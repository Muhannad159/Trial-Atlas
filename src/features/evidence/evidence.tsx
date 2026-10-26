import { getEvidence } from "@/lib/pubmed/client";
import type { TrialDetail } from "@/types/trial";
import { ArrowUpRight } from "lucide-react";
export async function Evidence({ trial }: { trial: TrialDetail }) {
  const { citations, unavailable } = await getEvidence(trial);
  return (
    <>
      {unavailable ? (
        <p className="text-sm text-muted">
          PubMed is temporarily unavailable. The trial record is still available
          above.
        </p>
      ) : citations.length ? (
        <div className="space-y-5">
          {citations.map((c) => (
            <article
              key={c.pmid}
              className="p-5 border border-line rounded-lg bg-white"
            >
              <p className="eyebrow mb-3">
                {c.source === "registry"
                  ? "Referenced in study record"
                  : "NCT identifier search"}
              </p>
              <a
                className="font-medium text-sm leading-6 text-teal"
                href={`https://pubmed.ncbi.nlm.nih.gov/${c.pmid}/`}
                target="_blank"
                rel="noreferrer"
              >
                {c.title} <ArrowUpRight size={14} className="inline" />
              </a>
              <p className="text-xs text-muted mt-2">
                {c.journal} · {c.date}
              </p>
              <p className="text-xs text-muted mt-1">{c.authors.join(", ")}</p>
            </article>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted">
          No linked PubMed citations were found. This does not mean the study
          has no publications or results.
        </p>
      )}
      <p className="text-xs text-muted leading-6 mt-5">
        Citations provide context and may describe background research rather
        than trial results. This product uses publicly available data from the
        U.S. National Library of Medicine (NLM), National Institutes of Health,
        Department of Health and Human Services; NLM is not responsible for the
        product and does not endorse or recommend this or any other product.
      </p>
    </>
  );
}
