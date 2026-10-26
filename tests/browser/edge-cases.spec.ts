import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("pagination preserves filters and a new search resets the cursor", async ({
  page,
}) => {
  await page.goto("/search?condition=diabetes&location=Cairo&phase=PHASE2");
  await page.getByRole("link", { name: "Next results" }).click();
  await expect(page).toHaveURL(/pageToken=second-page/);
  await expect(page.getByLabel("Study phase")).toHaveValue("PHASE2");
  await expect(page.getByLabel("City or country")).toHaveValue("Cairo");
  await expect(page.locator("article.trial-card")).toHaveCount(1);
  await page.getByLabel("Study type").selectOption("OBSERVATIONAL");
  await page.getByLabel("Recruitment status").selectOption("ALL");
  await page.getByRole("button", { name: "Find studies" }).click();
  await expect(page).not.toHaveURL(/pageToken/);
  await expect(page).toHaveURL(/studyType=OBSERVATIONAL/);
  await expect(page.getByLabel("Recruitment status")).toHaveValue("ALL");
});

test("missing, partial and unavailable comparisons remain understandable", async ({
  page,
}) => {
  await page.goto("/compare?ids=NCT00000001,NCT99999999,NCT99999998");
  await expect(page.locator("table thead th")).toHaveCount(2);
  await expect(
    page.getByText("Some study records could not be loaded.", { exact: false }),
  ).toBeVisible();
  await page.goto("/compare?ids=NCT99999999,NCT99999998");
  await expect(
    page.getByRole("heading", {
      name: "These study records could not be loaded",
    }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Download PDF" })).toHaveCount(
    0,
  );
  await page.goto(
    "/compare?ids=NCT00000001,NCT00000001,invalid,NCT00000002,NCT00000003,NCT00000004",
  );
  await expect(page.locator("table thead th")).toHaveCount(4);
});

test("export validation never silently drops missing records", async ({
  request,
}) => {
  for (const [path, status] of [
    ["/api/export/csv", 400],
    ["/api/export/xml?ids=NCT00000001", 404],
    [
      "/api/export/csv?ids=NCT00000001,NCT00000002,NCT00000003,NCT00000004",
      400,
    ],
    ["/api/export/pdf?ids=NCT00000001,NCT99999999", 404],
    ["/api/export/csv?ids=NCT99999998", 503],
  ] as const) {
    const response = await request.get(path);
    expect(response.status()).toBe(status);
    expect(response.headers()["x-robots-tag"]).toContain("noindex");
    expect(response.headers()["cache-control"]).toBe("no-store");
  }
});

test("download failure can be retried and clipboard denial has a fallback", async ({
  page,
}) => {
  await page.goto("/compare?ids=NCT00000001");
  await page.route("**/api/export/csv?*", (r) =>
    r.fulfill({ status: 503, body: "unavailable" }),
  );
  await page.getByRole("button", { name: "Export CSV" }).click();
  await expect(
    page.getByText("The export could not be generated. Please try again."),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Export CSV" })).toBeEnabled();
  await page.unroute("**/api/export/csv?*");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export CSV" }).click();
  expect((await downloadPromise).suggestedFilename()).toBe(
    "trialatlas-comparison.csv",
  );
  await page.evaluate(() =>
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: () => Promise.reject(new Error("Denied")) },
    }),
  );
  await page.getByRole("button", { name: "Copy share link" }).click();
  await expect(
    page.getByText(
      "Copy the current address from your browser to share this comparison.",
    ),
  ).toBeVisible();
});

test("mobile map outage leaves a usable text list and list toggle", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route("https://tiles.openfreemap.org/**", (r) => r.abort());
  await page.goto("/search?condition=diabetes");
  await page.getByRole("button", { name: "Map", exact: true }).click();
  await expect(
    page.getByText("Map unavailable. Use the accessible site list below."),
  ).toBeVisible();
  await page.getByText("Study locations in text", { exact: true }).click();
  await expect(
    page.getByText("Example site · Cairo · Egypt").first(),
  ).toBeVisible();
  await page.getByRole("button", { name: "List", exact: true }).click();
  await expect(page.locator("article.trial-card").first()).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("sparse records, malformed API payloads and inherited object names are safe", async ({
  page,
}) => {
  await page.goto("/trials/NCT99999997");
  await expect(
    page.getByRole("heading", { name: "Sparse test study" }),
  ).toBeVisible();
  await expect(
    page.getByText("No linked PubMed citations were found.", { exact: false }),
  ).toBeVisible();
  await page.goto("/search?condition=malformed");
  await expect(
    page.getByRole("heading", {
      name: "Live studies are temporarily unavailable",
    }),
  ).toBeVisible();
  for (const path of ["/constructor", "/__proto__", "/toString"]) {
    await page.goto(path);
    await expect(
      page.getByRole("heading", { name: /another starting point/ }),
    ).toBeVisible();
  }
});

test("search, details and comparison pass automated accessibility checks", async ({
  page,
}) => {
  for (const path of [
    "/search?condition=diabetes",
    "/trials/NCT00000001",
    "/compare?ids=NCT00000001,NCT00000002",
  ]) {
    await page.goto(path);
    await page.locator("h1").waitFor();
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(results.violations, path).toEqual([]);
  }
});

test("comparison tray is temporary and never uses browser storage", async ({
  page,
  context,
}) => {
  await page.goto("/search");
  await page
    .getByRole("button", { name: "Compare", exact: true })
    .first()
    .click();
  await expect(
    page.getByRole("complementary", { name: "Selected studies" }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => [localStorage.length, sessionStorage.length]),
  ).toEqual([0, 0]);
  expect(await context.cookies()).toEqual([]);
  await page.reload();
  await expect(
    page.getByRole("complementary", { name: "Selected studies" }),
  ).toHaveCount(0);
});

test("removing a compared study also updates the temporary tray", async ({
  page,
}) => {
  await page.goto("/search");
  await page
    .getByRole("button", { name: "Compare", exact: true })
    .first()
    .click();
  await page
    .getByRole("button", { name: "Compare", exact: true })
    .first()
    .click();
  await page.getByRole("link", { name: "Compare", exact: true }).click();
  await page.getByRole("link", { name: "Remove", exact: true }).first().click();
  await expect(page.locator("table thead th")).toHaveCount(2);
  await expect(
    page.getByRole("complementary", { name: "Selected studies" }),
  ).toContainText("1 of 3 studies selected");
});

test('source terms and contact omission remain visible across workflows', async ({page,request}) => {
  await page.goto('/data-terms');
  await expect(page.getByRole('heading',{name:'Data sources & terms'})).toBeVisible();
  await expect(page.getByText(/operator of TrialAtlas acknowledges and accepts/)).toBeVisible();
  await expect(page.getByRole('link',{name:'ClinicalTrials.gov terms and conditions'})).toHaveAttribute('href','https://clinicaltrials.gov/about-site/terms-conditions');
  await page.goto('/compare?ids=NCT00000001,NCT00000002');
  expect(await page.content()).not.toContain('research@example.org');
  await expect(page.getByRole('rowheader',{name:'Contacts',exact:true})).toHaveCount(0);
  const response=await request.get('/api/export/csv?ids=NCT00000001');
  const csv=await response.text();
  expect(response.status()).toBe(200);
  expect(csv).not.toContain('research@example.org');
  expect(csv).not.toContain('"Contacts"');
  expect(csv).toContain('study contact details omitted');
});
