import type { Metadata } from "next";
import type { TrialDetail } from "@/types/trial";
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");
export function metadata(
  title: string,
  description: string,
  path: string,
  noindex = false,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}${path}` },
    robots: noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      title: `${title} | TrialAtlas`,
      description,
      url: `${siteUrl}${path}`,
      type: "website",
      images: ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
  };
}
export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
export function trialStructuredData(t: TrialDetail) {
  return {
    "@context": "https://schema.org",
    "@type": t.studyType === "INTERVENTIONAL" ? "MedicalTrial" : "MedicalStudy",
    name: t.title,
    description: t.summary,
    url: `${siteUrl}/trials/${t.id}`,
    sameAs: `https://clinicaltrials.gov/study/${t.id}`,
    code: {
      "@type": "MedicalCode",
      codeValue: t.id,
      codingSystem: "ClinicalTrials.gov",
    },
    sponsor: { "@type": "Organization", name: t.sponsor },
    healthCondition: t.conditions.map((name) => ({
      "@type": "MedicalCondition",
      name,
    })),
    dateModified: t.updated || undefined,
  };
}
