import Link from "next/link";
import { getTrial } from "@/lib/clinical-trials/client";
import { comparisonIds, type SearchParams } from "@/lib/validation/search";
import { metadata as makeMetadata } from "@/lib/seo";
import { Breadcrumbs, Eyebrow, SourceLink } from "@/components/ui/primitives";
import { comparisonRows } from "@/features/comparison/rows";
import { RemoveComparisonLink } from "@/features/comparison/provider";
import { ComparisonActions } from "@/features/comparison/actions";
export const metadata = makeMetadata(
  "Compare clinical studies",
  "Compare study purpose, eligibility, interventions, outcomes, and locations.",
  "/compare",
  true,
);
export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const ids = comparisonIds((await searchParams).ids);
  const records = await Promise.allSettled(ids.map(getTrial));
  const trials = records.flatMap((r) =>
    r.status === "fulfilled" && r.value ? [r.value] : [],
  );
  return (
    <div className="container pb-12">
      <Breadcrumbs items={[{ label: "Compare studies" }]} />
      <div className="page-heading">
        <Eyebrow>See the details together</Eyebrow>
        <h1>A clearer comparison.</h1>
        <p>
          Review up to three studies side by side. Highlighted rows indicate
          differences—not a recommendation or a determination of eligibility.
        </p>
      </div>
      {trials.length ? (
        <>
          <ComparisonActions ids={trials.map((t) => t.id)} />
          {trials.length !== ids.length && (
            <p role="status" className="notice mb-5 text-sm">
              Some study records could not be loaded. This comparison includes
              only the available records.
            </p>
          )}
          <div
            className="compare-scroll"
            tabIndex={0}
            role="region"
            aria-label="Study comparison table, scroll horizontally on small screens"
          >
            <table className="compare-table">
              <caption className="sr-only">
                Clinical study comparison. Highlighted rows contain different
                reported values.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Study</th>
                  {trials.map((t) => (
                    <th scope="col" key={t.id}>
                      <p className="eyebrow mb-3">{t.id}</p>
                      <Link
                        className="text-sm leading-6 font-semibold"
                        href={`/trials/${t.id}`}
                      >
                        {t.title}
                      </Link>
                      <div className="mt-4">
                        <SourceLink id={t.id} />
                      </div>
                      <RemoveComparisonLink
                        id={t.id}
                        href={`/compare?ids=${ids.filter((id) => id !== t.id).join(",")}`}
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => {
                  const values = trials.map(row.get);
                  return (
                    <tr
                      key={row.name}
                      className={new Set(values).size > 1 ? "different" : ""}
                    >
                      <th scope="row">{row.name}</th>
                      {values.map((value, i) => (
                        <td key={trials[i].id}>
                          {row.name === "Eligibility" ||
                          row.name === "Locations" ? (
                            <details>
                              <summary className="text-teal cursor-pointer">
                                View {row.name.toLowerCase()}
                              </summary>
                              <p className="mt-3">{value}</p>
                            </details>
                          ) : (
                            value
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted mt-5">
            Data from ClinicalTrials.gov. Contact the study teams to confirm
            information before acting on it.
          </p>
        </>
      ) : (
        <div className="notice">
          <div>
            <h2 className="font-serif text-2xl">
              {ids.length
                ? "These study records could not be loaded"
                : "Start with a few possibilities"}
            </h2>
            <p className="text-sm text-muted mt-3 mb-5">
              {ids.length
                ? "The records may be unavailable or the registry may be temporarily offline. Retry this page or find other studies."
                : "Choose “Compare” on a study card. You can select up to three studies, then download or share your comparison."}
            </p>
            <Link href="/search" className="button button-primary">
              Find studies
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
