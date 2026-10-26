import type { TrialSearchFilters } from "@/lib/validation/search";
export function buildQuery(f: TrialSearchFilters) {
  const p = new URLSearchParams({
    format: "json",
    pageSize: "20",
    countTotal: "true",
    sort: "LastUpdatePostDate:desc",
    fields:
      "NCTId,BriefTitle,OverallStatus,LastUpdatePostDate,Phase,StudyType,Condition,LeadSponsorName,BriefSummary,LocationFacility,LocationCity,LocationCountry,LocationStatus,LocationGeoPoint",
  });
  if (f.condition) p.set("query.cond", f.condition);
  if (f.term) p.set("query.term", f.term);
  if (f.intervention) p.set("query.intr", f.intervention);
  if (f.location) p.set("query.locn", f.location);
  if (f.sponsor) p.set("query.spons", f.sponsor);
  if (f.status !== "ALL")
    p.set("filter.overallStatus", f.status.split(",").join("|"));
  const clauses: string[] = [];
  if (f.phase) clauses.push(`AREA[Phase]${f.phase}`);
  if (f.age) clauses.push(`AREA[StdAge]${f.age}`);
  if (f.sex) clauses.push(`AREA[Sex]${f.sex}`);
  if (f.studyType !== "ALL") clauses.push(`AREA[StudyType]${f.studyType}`);
  if (clauses.length) p.set("filter.advanced", clauses.join(" AND "));
  if (f.pageToken) p.set("pageToken", f.pageToken);
  return p;
}
