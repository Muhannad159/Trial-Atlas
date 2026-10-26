import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
import { allHubs } from "@/config/hubs";
import { editorial } from "@/config/editorial";
import { searchTrials } from "@/lib/clinical-trials/client";
import { parseFilters } from "@/lib/validation/search";
export const revalidate = 21600;
export const maxDuration = 60;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    "",
    ...Object.keys(editorial).map((p) => `/${p}`),
    ...allHubs.map((h) => `/${h.kind}/${h.slug}`),
  ].map((path) => ({ url: `${siteUrl}${path}`, changeFrequency: "weekly" }));
  const studies = new Map<string, string>();
  // Bound to at most 20 records per curated hub; never crawl the full registry.
  for (let start = 0; start < allHubs.length; start += 4) {
    const batch = await Promise.allSettled(
      allHubs
        .slice(start, start + 4)
        .map((hub) =>
          searchTrials(
            parseFilters(
              hub.kind === "conditions"
                ? { condition: hub.query }
                : { term: hub.query },
            ),
          ),
        ),
    );
    for (const result of batch)
      if (result.status === "fulfilled") {
        for (const t of result.value.studies) studies.set(t.id, t.updated);
      }
  }
  for (const [id, date] of studies)
    entries.push({
      url: `${siteUrl}/trials/${id}`,
      ...(date ? { lastModified: date } : {}),
      changeFrequency: "weekly",
    });
  return entries;
}
