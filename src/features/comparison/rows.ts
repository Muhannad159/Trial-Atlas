import type { TrialDetail } from "@/types/trial";
import { label } from "@/lib/validation/search";
export const comparisonRows: {
  name: string;
  get: (t: TrialDetail) => string;
}[] = [
  { name: "Status", get: (t) => label(t.status) },
  {
    name: "Phase",
    get: (t) =>
      t.phases.map(label).join(" / ") || "Not applicable / not provided",
  },
  { name: "Study type", get: (t) => label(t.studyType) || "Not provided" },
  { name: "Conditions", get: (t) => t.conditions.join("; ") || "Not provided" },
  { name: "Sponsor", get: (t) => t.sponsor },
  { name: "Purpose", get: (t) => t.summary || "Not provided" },
  {
    name: "Design",
    get: (t) => t.design.map(label).join("; ") || "Not provided",
  },
  {
    name: "Interventions",
    get: (t) =>
      t.interventions.map((i) => `${i.name} (${label(i.type)})`).join("\n") ||
      "Not provided",
  },
  { name: "Ages", get: (t) => `${t.minAge} to ${t.maxAge}` },
  { name: "Sex", get: (t) => label(t.sex) },
  {
    name: "Healthy volunteers",
    get: (t) =>
      t.healthyVolunteers === undefined
        ? "Not provided"
        : t.healthyVolunteers
          ? "Accepted"
          : "Not accepted",
  },
  { name: "Eligibility", get: (t) => t.eligibility || "Not provided" },
  {
    name: "Enrollment",
    get: (t) =>
      t.enrollment === undefined
        ? "Not provided"
        : `${t.enrollment.toLocaleString()} (${label(t.enrollmentType || "Not provided")})`,
  },
  {
    name: "Primary outcomes",
    get: (t) =>
      t.outcomes
        .map((o) => `${o.measure}${o.timeFrame ? ` — ${o.timeFrame}` : ""}`)
        .join("\n") || "Not provided",
  },
  { name: "Start date", get: (t) => t.startDate || "Not provided" },
  { name: "Completion date", get: (t) => t.completionDate || "Not provided" },
  {
    name: "Locations",
    get: (t) =>
      t.locations
        .map((l) => [l.facility, l.city, l.country].filter(Boolean).join(", "))
        .join("\n") || "Not provided",
  },
  { name: "Registry update", get: (t) => t.updated || "Not provided" },
];
