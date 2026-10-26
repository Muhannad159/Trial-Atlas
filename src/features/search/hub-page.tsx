import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import type { Hub } from "@/config/hubs";
import { allHubs } from "@/config/hubs";
import { parseFilters, searchHref } from "@/lib/validation/search";
import { searchTrials } from "@/lib/clinical-trials/client";
import { TrialCard } from "@/features/trials/trial-card";
import { Breadcrumbs, Eyebrow, Unavailable } from "@/components/ui/primitives";
import { jsonLd, siteUrl } from "@/lib/seo";
export function hubFilters(hub: Hub) {
  return parseFilters(
    hub.kind === "conditions" ? { condition: hub.query } : { term: hub.query },
  );
}
async function HubStudies({ hub }: { hub: Hub }) {
  const data = await searchTrials(hubFilters(hub)).catch(() => null);
  if (!data) return <Unavailable />;
  return data.studies.length ? (
    <div className="trial-grid">
      {data.studies.slice(0, 6).map((t) => (
        <TrialCard trial={t} key={t.id} />
      ))}
    </div>
  ) : (
    <p className="notice text-sm">
      No recruiting studies were returned for this topic. Try a related term or
      include additional statuses.
    </p>
  );
}
export function HubPage({ hub }: { hub: Hub }) {
  return (
    <div className="container pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
              {
                "@type": "ListItem",
                position: 2,
                name: hub.title,
                item: `${siteUrl}/${hub.kind}/${hub.slug}`,
              },
            ],
          }),
        }}
      />
      <Breadcrumbs items={[{ label: hub.title }]} />
      <div className="page-heading">
        <Eyebrow>{hub.eyebrow}</Eyebrow>
        <h1>{hub.title} clinical studies</h1>
        <p>{hub.description}</p>
        <Link
          href={searchHref(hubFilters(hub))}
          className="button button-primary mt-6"
        >
          Search this topic <ArrowRight size={15} />
        </Link>
      </div>
      <div className="notice mb-10">
        <div>
          <h2 className="font-serif text-xl mb-3">A useful place to begin</h2>
          <p className="text-sm text-muted leading-7 max-w-3xl">
            {hub.guidance}
          </p>
        </div>
      </div>
      <div className="section-heading">
        <div>
          <Eyebrow>From ClinicalTrials.gov</Eyebrow>
          <h2 className="mt-3">Explore current possibilities</h2>
        </div>
      </div>
      <p className="text-xs text-muted mb-6">
        Recruiting and not-yet-recruiting interventional studies. Selection is
        based on the topic query, not a clinical recommendation.
      </p>
      <Suspense
        fallback={
          <div className="trial-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-80" />
            ))}
          </div>
        }
      >
        <HubStudies hub={hub} />
      </Suspense>
      <section className="section max-w-3xl">
        <h2 className="editorial-title mb-7">Before you take the next step</h2>
        {[
          [
            "Does this mean I can join a study?",
            "No. These records help you explore research. The official study team determines eligibility after reviewing all study-specific requirements.",
          ],
          [
            "How current is this information?",
            "Records reflect updates submitted to ClinicalTrials.gov by study sponsors and investigators. TrialAtlas caches records for up to six hours; always verify status and availability with the study team.",
          ],
          [
            "What if I cannot find a nearby study?",
            "Try removing the location filter or searching another term for the condition. Ask the official contact whether travel or remote participation is possible rather than assuming that it is.",
          ],
        ].map(([q, a]) => (
          <details key={q} className="border-b border-line py-5">
            <summary className="text-sm font-medium">{q}</summary>
            <p className="text-sm text-muted leading-7 mt-3">{a}</p>
          </details>
        ))}
      </section>
      <div className="flex flex-wrap gap-2">
        {allHubs
          .filter((h) => h.slug !== hub.slug && h.kind === hub.kind)
          .map((h) => (
            <Link href={`/${h.kind}/${h.slug}`} key={h.slug} className="chip">
              {h.title}
            </Link>
          ))}
      </div>
    </div>
  );
}
