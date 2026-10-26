import { describe, it, expect, vi, afterEach } from "vitest";
import { searchTrials, getTrial } from "@/lib/clinical-trials/client";
import { getEvidence } from "@/lib/pubmed/client";
import { parseFilters } from "@/lib/validation/search";
import { studySchema } from "@/lib/clinical-trials/schema";
import { mapStudy } from "@/lib/clinical-trials/mapper";
import { study } from "./fixtures/study";
afterEach(() => vi.unstubAllGlobals());
describe("upstream boundaries", () => {
  it("validates and maps a paginated registry response", async () => {
    const fetcher = vi.fn().mockResolvedValue(
      Response.json({
        studies: [study],
        totalCount: 21,
        nextPageToken: "next-page",
      }),
    );
    vi.stubGlobal("fetch", fetcher);
    const data = await searchTrials(parseFilters({ condition: "diabetes" }));
    expect(data.totalCount).toBe(21);
    expect(data.nextPageToken).toBe("next-page");
    expect(data.studies[0].id).toBe("NCT00000001");
    expect(fetcher.mock.calls[0][0]).toContain("query.cond=diabetes");
  });
  it("rejects malformed data and surfaces upstream outages", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(Response.json({ unexpected: true })),
    );
    await expect(getTrial("NCT00000003")).rejects.toThrow();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("", { status: 503 })),
    );
    await expect(searchTrials(parseFilters({}))).rejects.toThrow(
      "temporarily unavailable",
    );
  });
  it("returns null for missing or invalid identifiers", async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValue(new Response("", { status: 404 }));
    vi.stubGlobal("fetch", fetcher);
    expect(await getTrial("invalid")).toBeNull();
    expect(fetcher).not.toHaveBeenCalled();
    expect(await getTrial("NCT00000009")).toBeNull();
  });
  it("uses registry PMIDs for evidence and isolates evidence failures", async () => {
    const fetcher = vi.fn().mockResolvedValue(
      Response.json({
        result: {
          "12345678": {
            title: "Example evidence",
            fulljournalname: "Example Journal",
            pubdate: "2026",
            authors: [{ name: "Example author" }],
          },
        },
      }),
    );
    vi.stubGlobal("fetch", fetcher);
    const trial = mapStudy(studySchema.parse(study));
    const evidence = await getEvidence(trial);
    expect(evidence.citations[0].source).toBe("registry");
    expect(fetcher.mock.calls[0][0]).toContain("id=12345678");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Offline")));
    expect((await getEvidence(trial)).unavailable).toBe(true);
  });
});

it("does not mistake a malformed search response for zero matches", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(Response.json({ unexpected: true })),
  );
  await expect(searchTrials(parseFilters({}))).rejects.toThrow();
});
it("isolates network timeouts from empty results", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockRejectedValue(new DOMException("Timed out", "TimeoutError")),
  );
  await expect(searchTrials(parseFilters({}))).rejects.toThrow("Timed out");
});
it("uses exact NCT lookup only when registry references are absent", async () => {
  const fetcher = vi
    .fn()
    .mockResolvedValueOnce(
      Response.json({ esearchresult: { idlist: ["87654321"] } }),
    )
    .mockResolvedValueOnce(
      Response.json({
        result: { "87654321": { title: "Identifier-linked article" } },
      }),
    );
  vi.stubGlobal("fetch", fetcher);
  const trial = { ...mapStudy(studySchema.parse(study)), references: [] };
  const result = await getEvidence(trial);
  expect(new URL(fetcher.mock.calls[0][0]).searchParams.get("term")).toBe(
    "NCT00000001[All Fields]",
  );
  expect(result.citations[0].source).toBe("identifier-search");
});
