import { describe, it, expect } from "vitest";
import {
  parseFilters,
  comparisonIds,
  searchHref,
  label,
} from "@/lib/validation/search";
import { buildQuery } from "@/lib/clinical-trials/query";
import { studySchema } from "@/lib/clinical-trials/schema";
import { mapStudy } from "@/lib/clinical-trials/mapper";
import { comparisonCsv, csvCell } from "@/features/comparison/export";
import { jsonLd, trialStructuredData } from "@/lib/seo";
import { study } from "./fixtures/study";
describe("public search contract", () => {
  it("defaults to open interventional studies and safely bounds URL filters", () => {
    const f = parseFilters({
      condition: "x".repeat(161),
      phase: "malicious",
      studyType: "bad",
      location: ["Cairo", "London"],
    });
    expect(f.condition).toBe("");
    expect(f.phase).toBe("");
    expect(f.studyType).toBe("INTERVENTIONAL");
    expect(f.location).toBe("Cairo");
    expect(f.status).toBe("RECRUITING,NOT_YET_RECRUITING");
  });
  it("maps controlled values to API clauses and URL-encodes free text", () => {
    const f = parseFilters({
      condition: "heart & vascular",
      age: "ADULT",
      phase: "PHASE2",
      sex: "FEMALE",
      studyType: "ALL",
    });
    const p = buildQuery(f);
    expect(p.get("query.cond")).toBe("heart & vascular");
    expect(p.get("filter.advanced")).toBe(
      "AREA[Phase]PHASE2 AND AREA[StdAge]ADULT AND AREA[Sex]FEMALE",
    );
    expect(
      new URL(searchHref(f), "https://example.org").searchParams.get(
        "condition",
      ),
    ).toBe(f.condition);
  });
  it("rejects forged study IDs, deduplicates, and limits comparisons to three", () => {
    expect(
      comparisonIds(
        "NCT00000001,<script>,NCT00000001,NCT00000002,NCT00000003,NCT00000004",
      ),
    ).toEqual(["NCT00000001", "NCT00000002", "NCT00000003"]);
  });
});
describe("record mapping and exports", () => {
  it("preserves site status, coordinates, references and source identifiers", () => {
    const t = mapStudy(studySchema.parse(study));
    expect(t.locations[0]).toMatchObject({
      lat: 30.04,
      lng: 31.23,
      status: "RECRUITING",
    });
    expect(t.references).toEqual([{ pmid: "12345678", type: "BACKGROUND" }]);
    expect(t.healthyVolunteers).toBe(false);
  });
  it("handles genuinely missing optional data without inventing facts", () => {
    const t = mapStudy(
      studySchema.parse({
        protocolSection: {
          identificationModule: {
            nctId: "NCT00000002",
            briefTitle: "Sparse study",
          },
          statusModule: { overallStatus: "UNKNOWN" },
        },
      }),
    );
    expect(t.locations).toEqual([]);
    expect(t.enrollment).toBeUndefined();
    expect(t.healthyVolunteers).toBeUndefined();
    expect(t.phases).toEqual([]);
  });
  it("prevents spreadsheet formula injection and escapes quotes and newlines", () => {
    expect(csvCell('=HYPERLINK("bad")')).toBe('"\'=HYPERLINK(""bad"")"');
    expect(csvCell("a\nb")).toBe('"a\nb"');
    const csv = comparisonCsv({
      trials: [mapStudy(studySchema.parse(study))],
      generatedAt: "2026-01-01T00:00:00Z",
      source: "ClinicalTrials.gov",
    });
    expect(csv).toContain("https://clinicaltrials.gov/study/NCT00000001");
    expect(csv).toContain("2026-01-01T00:00:00Z");
  });
  it("escapes script-closing text in JSON-LD and distinguishes study types", () => {
    expect(
      jsonLd({ title: "</script><script>alert(1)</script>" }),
    ).not.toContain("<");
    const t = mapStudy(studySchema.parse(study));
    expect(trialStructuredData(t)["@type"]).toBe("MedicalTrial");
    expect(
      trialStructuredData({ ...t, studyType: "OBSERVATIONAL" })["@type"],
    ).toBe("MedicalStudy");
  });
});

it("normalizes malformed and oversized URL filters without throwing", () => {
  const f = parseFilters({
    status: "x".repeat(301),
    pageToken: "x".repeat(2049),
    condition: ["heart & vascular", "ignored"],
  });
  expect(f.status).toBe("RECRUITING,NOT_YET_RECRUITING");
  expect(f.pageToken).toBe("");
  expect(f.condition).toBe("heart & vascular");
  expect(label("PHASE2")).toBe("Phase 2");
});

it("discards structured contact details before rendering or export", () => {
  const raw = structuredClone(study);
  raw.protocolSection.contactsLocationsModule.centralContacts = [
    { name: "Private contact name", email: "private-contact@example.org" },
  ];
  const parsed = studySchema.parse(raw);
  const mapped = mapStudy(parsed);
  expect(JSON.stringify(parsed)).not.toContain("private-contact@example.org");
  expect(JSON.stringify(mapped)).not.toContain("Private contact name");
  const csv = comparisonCsv({
    trials: [mapped],
    source: "ClinicalTrials.gov",
    generatedAt: "2026-10-26T00:00:00Z",
  });
  expect(csv).not.toContain("private-contact@example.org");
  expect(csv).not.toContain('"Contacts"');
  expect(csv).toContain("https://clinicaltrials.gov/study/NCT00000001");
});
