import { z } from "zod";

export const statuses = [
  "RECRUITING",
  "NOT_YET_RECRUITING",
  "ACTIVE_NOT_RECRUITING",
  "COMPLETED",
  "ENROLLING_BY_INVITATION",
  "SUSPENDED",
  "TERMINATED",
  "WITHDRAWN",
  "UNKNOWN",
] as const;
export const defaultStatus = "RECRUITING,NOT_YET_RECRUITING";
const text = z.string().trim().max(160).catch("");
export const filtersSchema = z.object({
  condition: text.default(""),
  term: text.default(""),
  intervention: text.default(""),
  location: text.default(""),
  sponsor: text.default(""),
  status: z
    .string()
    .max(300)
    .catch(defaultStatus)
    .default(defaultStatus)
    .transform((v) =>
      v === "ALL"
        ? "ALL"
        : v
            .split(",")
            .filter((s) => (statuses as readonly string[]).includes(s))
            .join(",") || defaultStatus,
    ),
  phase: z
    .enum(["", "EARLY_PHASE1", "PHASE1", "PHASE2", "PHASE3", "PHASE4", "NA"])
    .catch(""),
  age: z.enum(["", "CHILD", "ADULT", "OLDER_ADULT"]).catch(""),
  sex: z.enum(["", "FEMALE", "MALE", "ALL"]).catch(""),
  studyType: z
    .enum(["INTERVENTIONAL", "OBSERVATIONAL", "ALL"])
    .catch("INTERVENTIONAL"),
  pageToken: z.string().max(2048).catch("").default(""),
});
export type TrialSearchFilters = z.infer<typeof filtersSchema>;
export type SearchParams = Record<string, string | string[] | undefined>;
export function parseFilters(params: SearchParams): TrialSearchFilters {
  return filtersSchema.parse(
    Object.fromEntries(
      Object.entries(params).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]),
    ),
  );
}
export const nctSchema = z.string().regex(/^NCT\d{8}$/);
export function comparisonIds(input: string | string[] | undefined): string[] {
  const value = Array.isArray(input) ? input[0] : input;
  return [
    ...new Set(
      (value || "").split(",").filter((id) => nctSchema.safeParse(id).success),
    ),
  ].slice(0, 3);
}
export function searchHref(filters: Partial<TrialSearchFilters>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters))
    if (value) params.set(key, value);
  return `/search?${params.toString()}`;
}
export function comparisonHref(ids: string[]) {
  return `/compare?ids=${ids.join(",")}`;
}
export function label(value: string) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/phase(\d)/g, "phase $1")
    .replace(/^\w/, (c) => c.toUpperCase());
}
