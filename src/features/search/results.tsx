"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { List, Map, ArrowRight } from "lucide-react";
import { TrialCard } from "@/features/trials/trial-card";
import type { PaginatedTrials } from "@/types/trial";
import { searchHref, type TrialSearchFilters } from "@/lib/validation/search";
const StudyMap = dynamic(() => import("@/features/locations/study-map"), {
  ssr: false,
  loading: () => (
    <div className="map-frame map-placeholder">Loading study locations…</div>
  ),
});
export function Results({
  data,
  filters,
}: {
  data: PaginatedTrials;
  filters: TrialSearchFilters;
}) {
  const [view, setView] = useState<"list" | "map">("list");
  if (!data.studies.length)
    return (
      <div className="notice my-10">
        <div>
          <h2 className="font-serif text-2xl">
            No studies found for these filters
          </h2>
          <p className="text-sm text-muted mt-3 mb-5">
            Try a broader condition, remove the location, or include more
            recruitment statuses.
          </p>
          <Link className="button" href="/search">
            Reset filters
          </Link>
        </div>
      </div>
    );
  return (
    <>
      <div className="flex justify-between items-center py-7 gap-3">
        <p className="text-sm">
          <strong>
            {data.totalCount?.toLocaleString() ?? data.studies.length}
          </strong>{" "}
          studies found{" "}
          <span className="text-muted">· ordered by last update</span>
        </p>
        <Link href="/search" className="text-link shrink-0">
          Clear filters
        </Link>
      </div>
      <div className="mobile-view-switch">
        <button
          className={`button ${view === "list" ? "button-primary" : ""}`}
          aria-pressed={view === "list"}
          onClick={() => setView("list")}
        >
          <List size={15} />
          List
        </button>
        <button
          className={`button ${view === "map" ? "button-primary" : ""}`}
          aria-pressed={view === "map"}
          onClick={() => setView("map")}
        >
          <Map size={15} />
          Map
        </button>
      </div>
      <div className="results-shell">
        <div className={view === "map" ? "mobile-hidden" : ""}>
          <div className="result-list">
            {data.studies.map((t) => (
              <TrialCard key={t.id} trial={t} />
            ))}
          </div>
          <div className="flex justify-between items-center gap-4 mt-6">
            {filters.pageToken ? (
              <Link
                href={searchHref({ ...filters, pageToken: "" })}
                className="text-link"
              >
                First page
              </Link>
            ) : (
              <span />
            )}
            {data.nextPageToken && (
              <Link
                className="button button-primary"
                href={searchHref({ ...filters, pageToken: data.nextPageToken })}
              >
                Next results <ArrowRight size={15} />
              </Link>
            )}
          </div>
        </div>
        <div className={view === "list" ? "mobile-hidden" : ""}>
          <StudyMap trials={data.studies} />
          <details className="mt-5 border border-line rounded-lg p-4 text-xs">
            <summary>Study locations in text</summary>
            <ul className="mt-4 space-y-4">
              {data.studies.map((t) => (
                <li key={t.id}>
                  <Link
                    href={`/trials/${t.id}`}
                    className="text-teal underline"
                  >
                    {t.title}
                  </Link>
                  <ul className="mt-2 space-y-1 text-muted">
                    {t.locations.length ? (
                      t.locations.map((l, i) => (
                        <li key={i}>
                          {[l.facility, l.city, l.country]
                            .filter(Boolean)
                            .join(" · ")}
                        </li>
                      ))
                    ) : (
                      <li>No locations provided.</li>
                    )}
                  </ul>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </div>
    </>
  );
}
