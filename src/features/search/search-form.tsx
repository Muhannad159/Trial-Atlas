import { Search, SlidersHorizontal } from "lucide-react";
import {
  defaultStatus,
  statuses,
  label,
  type TrialSearchFilters,
} from "@/lib/validation/search";
export function SearchForm({
  filters,
  advanced = false,
}: {
  filters?: TrialSearchFilters;
  advanced?: boolean;
}) {
  return (
    <form action="/search" className="hero-search" role="search">
      <div className="search-bar">
        <label>
          <span className="field-label">Condition or disease</span>
          <input
            className="input"
            name="condition"
            placeholder="e.g. diabetes, breast cancer"
            maxLength={160}
            defaultValue={filters?.condition}
          />
        </label>
        <label>
          <span className="field-label">
            City or country <span className="font-normal">(optional)</span>
          </span>
          <input
            className="input"
            name="location"
            placeholder="Anywhere in the world"
            maxLength={160}
            defaultValue={filters?.location}
          />
        </label>
        <button className="button button-primary" type="submit">
          <Search size={17} />
          Find studies
        </button>
      </div>
      {advanced ? (
        <details
          className="mt-5"
          open={
            !!(
              filters?.term ||
              filters?.phase ||
              filters?.intervention ||
              filters?.sponsor ||
              filters?.age ||
              filters?.sex ||
              (filters?.status && filters.status !== defaultStatus) ||
              filters?.studyType === "ALL" ||
              filters?.studyType === "OBSERVATIONAL"
            )
          }
        >
          <summary className="text-xs text-teal">
            <SlidersHorizontal size={13} className="inline mr-2" />
            More search options
          </summary>
          <div className="filter-grid">
            <label>
              <span className="field-label">Keyword or NCT number</span>
              <input
                name="term"
                className="input"
                maxLength={160}
                defaultValue={filters?.term}
              />
            </label>
            <label>
              <span className="field-label">Intervention or treatment</span>
              <input
                name="intervention"
                className="input"
                maxLength={160}
                defaultValue={filters?.intervention}
              />
            </label>
            <label>
              <span className="field-label">Sponsor</span>
              <input
                name="sponsor"
                className="input"
                maxLength={160}
                defaultValue={filters?.sponsor}
              />
            </label>
            <label>
              <span className="field-label">Recruitment status</span>
              <select
                className="input"
                name="status"
                defaultValue={filters?.status || defaultStatus}
              >
                <option value={defaultStatus}>
                  Recruiting & not yet recruiting
                </option>
                <option value="ALL">All statuses</option>
                {statuses.map((s) => (
                  <option value={s} key={s}>
                    {label(s)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="field-label">Study phase</span>
              <select
                name="phase"
                className="input"
                defaultValue={filters?.phase || ""}
              >
                <option value="">Any phase</option>
                {[
                  "EARLY_PHASE1",
                  "PHASE1",
                  "PHASE2",
                  "PHASE3",
                  "PHASE4",
                  "NA",
                ].map((p) => (
                  <option key={p} value={p}>
                    {p === "NA" ? "Not applicable" : label(p)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="field-label">Age group</span>
              <select
                name="age"
                className="input"
                defaultValue={filters?.age || ""}
              >
                <option value="">Any age group</option>
                <option value="CHILD">Children (under 18)</option>
                <option value="ADULT">Adults (18–64)</option>
                <option value="OLDER_ADULT">Older adults (65+)</option>
              </select>
            </label>
            <label>
              <span className="field-label">Sex eligibility</span>
              <select
                name="sex"
                className="input"
                defaultValue={filters?.sex || ""}
              >
                <option value="">Any criteria</option>
                <option value="ALL">All sexes accepted</option>
                <option value="FEMALE">Female only</option>
                <option value="MALE">Male only</option>
              </select>
            </label>
            <label>
              <span className="field-label">Study type</span>
              <select
                name="studyType"
                className="input"
                defaultValue={filters?.studyType || "INTERVENTIONAL"}
              >
                <option value="INTERVENTIONAL">Interventional trials</option>
                <option value="OBSERVATIONAL">Observational studies</option>
                <option value="ALL">All study types</option>
              </select>
            </label>
          </div>
          <p className="text-xs text-muted mt-4">
            Filters describe study records. They do not determine whether you
            qualify.
          </p>
        </details>
      ) : (
        <input type="hidden" name="status" value={defaultStatus} />
      )}
    </form>
  );
}
