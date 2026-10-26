import "server-only";
import { z } from "zod";
import type { PubMedCitation, TrialDetail } from "@/types/trial";

// Serialize within each process; bound requests and cache at the framework layer.
let queue: Promise<unknown> = Promise.resolve();
let lastRequest = 0;
function ncbi(
  endpoint: string,
  params: Record<string, string>,
): Promise<unknown> {
  const run = queue
    .catch(() => undefined)
    .then(async () => {
      const delay = Math.max(0, 360 - (Date.now() - lastRequest));
      if (delay) await new Promise((resolve) => setTimeout(resolve, delay));
      lastRequest = Date.now();
      const query = new URLSearchParams({
        ...params,
        retmode: "json",
        tool: process.env.NCBI_TOOL || "trialatlas",
      });
      if (process.env.NCBI_EMAIL) query.set("email", process.env.NCBI_EMAIL);
      if (process.env.NCBI_API_KEY)
        query.set("api_key", process.env.NCBI_API_KEY);
      const response = await fetch(
        `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/${endpoint}?${query}`,
        { next: { revalidate: 86400 }, signal: AbortSignal.timeout(8000) },
      );
      if (!response.ok) throw new Error("Evidence unavailable");
      return response.json();
    });
  queue = run;
  return run;
}
export async function getEvidence(
  trial: TrialDetail,
): Promise<{ citations: PubMedCitation[]; unavailable: boolean }> {
  try {
    let ids = [...new Set(trial.references.map((r) => r.pmid))].slice(0, 8);
    let source: PubMedCitation["source"] = "registry";
    if (!ids.length) {
      const search = z
        .object({
          esearchresult: z.object({
            idlist: z.array(z.string().regex(/^\d+$/)),
          }),
        })
        .parse(
          await ncbi("esearch.fcgi", {
            db: "pubmed",
            term: `${trial.id}[All Fields]`,
            retmax: "5",
          }),
        );
      ids = search.esearchresult.idlist;
      source = "identifier-search";
    }
    if (!ids.length) return { citations: [], unavailable: false };
    const data = z
      .object({ result: z.record(z.string(), z.unknown()) })
      .parse(await ncbi("esummary.fcgi", { db: "pubmed", id: ids.join(",") }));
    const schema = z.object({
      title: z.string(),
      fulljournalname: z.string().default(""),
      pubdate: z.string().default(""),
      authors: z.array(z.object({ name: z.string() })).default([]),
    });
    return {
      unavailable: false,
      citations: ids.flatMap((pmid) => {
        const parsed = schema.safeParse(data.result[pmid]);
        return parsed.success
          ? [
              {
                pmid,
                title: parsed.data.title,
                journal: parsed.data.fulljournalname,
                date: parsed.data.pubdate,
                authors: parsed.data.authors.slice(0, 3).map((a) => a.name),
                source,
              },
            ]
          : [];
      }),
    };
  } catch {
    return { citations: [], unavailable: true };
  }
}
