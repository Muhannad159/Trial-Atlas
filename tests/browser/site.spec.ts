import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("search, compare, share, and exports work end to end", async ({
  page,
}) => {
  await page.goto("/search?condition=diabetes");
  await expect(page.locator("article.trial-card")).toHaveCount(4);
  const buttons = page.getByRole("button", { name: "Compare", exact: true });
  await buttons.first().click();
  await buttons.first().click();
  await buttons.first().click();
  await buttons.first().click();
  await expect(page.getByRole("status")).toContainText("up to 3 studies");
  await page.getByRole("link", { name: "Compare", exact: true }).click();
  await expect(page).toHaveURL(/ids=NCT00000001,NCT00000002,NCT00000003/);
  await expect(page.locator("table thead th")).toHaveCount(4);
  await page.reload();
  await expect(page.locator("table thead th")).toHaveCount(4);
  const csv = await page.request.get(
    "/api/export/csv?ids=NCT00000001,NCT00000002",
  );
  expect(csv.status()).toBe(200);
  expect(await csv.text()).toContain("Official source");
  const pdf = await page.request.get(
    "/api/export/pdf?ids=NCT00000001,NCT00000002",
  );
  expect(pdf.status()).toBe(200);
  expect((await pdf.body()).subarray(0, 4).toString()).toBe("%PDF");
  await page.getByRole("link", { name: "Remove", exact: true }).first().click();
  await expect(page.locator("table thead th")).toHaveCount(3);
});
test("study details preserve context and evidence; search handles empty and outage states", async ({
  page,
}) => {
  await page.goto("/trials/NCT00000001");
  await expect(
    page.getByRole("heading", { name: "Example diabetes research study 1" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Example background article/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Contact team on ClinicalTrials.gov" }),
  ).toHaveAttribute("href", "https://clinicaltrials.gov/study/NCT00000001");
  await expect(page.locator('a[href^="mailto:"], a[href^="tel:"]')).toHaveCount(
    0,
  );
  expect(await page.content()).not.toContain("research@example.org");
  expect(
    await page
      .locator('script[type="application/ld+json"]')
      .first()
      .textContent(),
  ).toContain("MedicalTrial");
  await page.goto("/search?condition=empty");
  await expect(
    page.getByRole("heading", { name: "No studies found for these filters" }),
  ).toBeVisible();
  await page.goto("/search?condition=outage");
  await expect(
    page.getByRole("heading", {
      name: "Live studies are temporarily unavailable",
    }),
  ).toBeVisible();
});
test("home is understandable, accessible, and navigable on mobile", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Every discovery starts/ }),
  ).toBeVisible();
  await expect(page.getByLabel("Condition or disease")).toBeVisible();
  await page.setViewportSize({ width: 375, height: 812 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const audit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(audit.violations).toEqual([]);
  await page.getByLabel("Condition or disease").fill("diabetes");
  await page.getByLabel("City or country").fill("Cairo");
  await page.getByRole("button", { name: "Find studies" }).click();
  await expect(page).toHaveURL(/condition=diabetes/);
  await expect(page).toHaveURL(/location=Cairo/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
});
test("invalid identifiers and empty comparison have useful outcomes", async ({
  page,
}) => {
  await page.goto("/trials/invalid");
  await expect(
    page.getByRole("heading", { name: /another starting point/ }),
  ).toBeVisible();
  await page.goto("/compare");
  await expect(
    page.getByRole("heading", { name: "Start with a few possibilities" }),
  ).toBeVisible();
  const res = await page.request.get("/api/export/csv?ids=invalid");
  expect(res.status()).toBe(400);
});
test("metadata and primary content exist in server-rendered HTML", async ({
  request,
}) => {
  const home = await request.get("/");
  const html = await home.text();
  expect(html).toContain("Every discovery starts");
  expect(html).toContain('rel="canonical"');
  expect((await request.get("/robots.txt")).status()).toBe(200);
  expect(
    (await request.get("/opengraph-image")).headers()["content-type"],
  ).toContain("image/png");
});
