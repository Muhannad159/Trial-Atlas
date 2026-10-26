import Link from "next/link";
import { MapPin, ArrowUpRight } from "lucide-react";
import type { TrialSummary } from "@/types/trial";
import { CompareButton } from "@/features/comparison/provider";
import { Status } from "@/components/ui/primitives";
import { label } from "@/lib/validation/search";
export function TrialCard({ trial }: { trial: TrialSummary }) {
  const countries = [
    ...new Set(trial.locations.map((l) => l.country).filter(Boolean)),
  ];
  return (
    <article className="trial-card">
      <div className="flex items-center justify-between gap-2">
        <Status status={trial.status} />
        <span className="text-[10px] text-muted">
          {trial.phases.map(label).join(" / ") || label(trial.studyType)}
        </span>
      </div>
      <h3>
        <Link href={`/trials/${trial.id}`}>{trial.title}</Link>
      </h3>
      <p className="text-[10px] uppercase tracking-wide text-teal mb-3">
        {trial.conditions.slice(0, 2).join(" · ")}
      </p>
      <p className="trial-card-summary">
        {trial.summary ||
          "Open the study record to explore its design and participation criteria."}
      </p>
      <p className="flex gap-2 text-[11px] text-muted mb-4">
        <MapPin size={14} className="shrink-0" aria-hidden="true" />
        {countries.length
          ? `${countries.slice(0, 2).join(", ")}${countries.length > 2 ? ` +${countries.length - 2} more` : ""}`
          : "Location not provided"}
      </p>
      <p className="text-[11px] text-muted mb-4">
        Registry update: {trial.updated || "Not provided"}
      </p>
      <div className="card-footer">
        <CompareButton id={trial.id} title={trial.title} />
        <Link href={`/trials/${trial.id}`} className="text-link">
          View study <ArrowUpRight size={14} />
        </Link>
      </div>
    </article>
  );
}
