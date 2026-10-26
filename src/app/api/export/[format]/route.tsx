import { NextRequest } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { z } from "zod";
import { getTrial } from "@/lib/clinical-trials/client";
import { nctSchema } from "@/lib/validation/search";
import { comparisonCsv } from "@/features/comparison/export";
import { ComparisonPdf } from "@/features/comparison/pdf";
import type { TrialDetail, ComparisonExport } from "@/types/trial";
export const runtime = "nodejs";
export const maxDuration = 30;
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ format: string }> },
) {
  const { format } = await params;
  const headers = {
    "X-Robots-Tag": "noindex, nofollow",
    "Cache-Control": "no-store",
  };
  if (!["pdf", "csv"].includes(format))
    return Response.json(
      { error: "Unsupported format" },
      { status: 404, headers },
    );
  const parsed = z
    .array(nctSchema)
    .min(1)
    .max(3)
    .safeParse(request.nextUrl.searchParams.get("ids")?.split(",") || []);
  if (!parsed.success)
    return Response.json(
      { error: "Provide one to three valid study IDs." },
      { status: 400, headers },
    );
  try {
    const records = await Promise.all([...new Set(parsed.data)].map(getTrial));
    if (records.some((t) => !t))
      return Response.json(
        { error: "A study was not found." },
        { status: 404, headers },
      );
    const data: ComparisonExport = {
      trials: records as TrialDetail[],
      generatedAt: new Date().toISOString(),
      source: "ClinicalTrials.gov",
    };
    if (format === "csv")
      return new Response(comparisonCsv(data), {
        headers: {
          ...headers,
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition":
            'attachment; filename="trialatlas-comparison.csv"',
        },
      });
    const pdf = await renderToBuffer(<ComparisonPdf data={data} />);
    return new Response(new Uint8Array(pdf), {
      headers: {
        ...headers,
        "Content-Type": "application/pdf",
        "Content-Disposition":
          'attachment; filename="trialatlas-comparison.pdf"',
      },
    });
  } catch {
    return Response.json(
      { error: "The export could not be generated. Please try again." },
      { status: 503, headers },
    );
  }
}
