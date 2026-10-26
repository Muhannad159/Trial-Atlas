import type { ComparisonExport } from "@/types/trial";
import { comparisonRows } from "./rows";
export function csvCell(value: string) {
  const safe = /^[\s]*[=+@\-\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replaceAll('"', '""')}"`;
}
export function comparisonCsv(data: ComparisonExport) {
  const rows = [
    ["Field", ...data.trials.map((t) => t.id)],
    ["Title", ...data.trials.map((t) => t.title)],
    ...comparisonRows.map((row) => [row.name, ...data.trials.map(row.get)]),
    [
      "Official source",
      ...data.trials.map((t) => `https://clinicaltrials.gov/study/${t.id}`),
    ],
    ["Report generated", ...data.trials.map(() => data.generatedAt)],
    [
      "Notice",
      ...data.trials.map(
        () =>
          "Source: ClinicalTrials.gov. Selected fields reformatted for comparison; study contact details omitted. Study teams determine eligibility. Cached data may be out of date; check the official record.",
      ),
    ],
  ];
  return "\uFEFF" + rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
}
