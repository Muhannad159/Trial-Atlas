import "server-only";
import { cache } from "react";
import { z } from "zod";
import { studySchema } from "./schema";
import { mapStudy } from "./mapper";
import { buildQuery } from "./query";
import { nctSchema, type TrialSearchFilters } from "@/lib/validation/search";
import type { PaginatedTrials } from "@/types/trial";

const base = "https://clinicaltrials.gov/api/v2";
async function request(path: string) {
  const res = await fetch(`${base}${path}`, {
    next: { revalidate: 21600 },
    signal: AbortSignal.timeout(12000),
    headers: { Accept: "application/json" },
  });
  if (res.status === 404) return null;
  if (!res.ok)
    throw new Error(
      "ClinicalTrials.gov is temporarily unavailable. Please try again shortly.",
    );
  return res.json();
}
export async function searchTrials(
  filters: TrialSearchFilters,
): Promise<PaginatedTrials> {
  const data = z
    .object({
      studies: z.array(studySchema),
      nextPageToken: z.string().optional(),
      totalCount: z.number().optional(),
    })
    .parse(await request(`/studies?${buildQuery(filters)}`));
  return {
    studies: data.studies.map(mapStudy),
    nextPageToken: data.nextPageToken,
    totalCount: data.totalCount,
  };
}
export const getTrial = cache(async (id: string) => {
  if (!nctSchema.safeParse(id).success) return null;
  const data = await request(`/studies/${id}`);
  return data ? mapStudy(studySchema.parse(data)) : null;
});
