import { Suspense } from "react";
import { SearchForm } from "@/features/search/search-form";
import { Results } from "@/features/search/results";
import { searchTrials } from "@/lib/clinical-trials/client";
import {
  parseFilters,
  type SearchParams,
  type TrialSearchFilters,
} from "@/lib/validation/search";
import { Breadcrumbs, Eyebrow, Unavailable } from "@/components/ui/primitives";
import { metadata as makeMetadata } from "@/lib/seo";
export const metadata = makeMetadata(
  "Find clinical studies",
  "Search public clinical study records by condition, location, phase, and recruitment status.",
  "/search",
  true,
);
async function LiveResults({ filters }: { filters: TrialSearchFilters }) {
  const data = await searchTrials(filters).catch(() => null);
  if (!data)
    return (
      <div className="my-8">
        <Unavailable />
      </div>
    );
  return <Results data={data} filters={filters} />;
}
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const filters = parseFilters(await searchParams);
  return (
    <div className="container pb-10">
      <Breadcrumbs items={[{ label: "Find studies" }]} />
      <div className="page-heading">
        <Eyebrow>Follow your curiosity</Eyebrow>
        <h1>Find a study. Explore a possibility.</h1>
        <p>Search public research records and see the details in context.</p>
      </div>
      <SearchForm
        key={`form-${JSON.stringify(filters)}`}
        filters={filters}
        advanced
      />
      <Suspense
        key={JSON.stringify(filters)}
        fallback={
          <div className="skeleton h-96 my-8" aria-label="Loading studies" />
        }
      >
        <LiveResults filters={filters} />
      </Suspense>
    </div>
  );
}
