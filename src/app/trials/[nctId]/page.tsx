import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { getTrial } from "@/lib/clinical-trials/client";
import {
  metadata as makeMetadata,
  jsonLd,
  trialStructuredData,
  siteUrl,
} from "@/lib/seo";
import { label } from "@/lib/validation/search";
import {
  Breadcrumbs,
  Eyebrow,
  Fact,
  SourceLink,
  Status,
} from "@/components/ui/primitives";
import { CompareButton } from "@/features/comparison/provider";
import { StudyMarkdown } from "@/features/trials/markdown";
import { Evidence } from "@/features/evidence/evidence";
import { DetailMap } from "@/features/locations/detail-map";

type Props = { params: Promise<{ nctId: string }> };
export async function generateMetadata({ params }: Props) {
  const { nctId } = await params;
  const trial = await getTrial(nctId);
  return trial
    ? makeMetadata(
        trial.title,
        `${trial.summary.slice(0, 155)}${trial.summary.length > 155 ? "…" : ""}`,
        `/trials/${trial.id}`,
      )
    : { title: "Study not found", robots: { index: false } };
}
export default async function TrialPage({ params }: Props) {
  const trial = await getTrial((await params).nctId);
  if (!trial) notFound();
  return (
    <div className="container pb-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(trialStructuredData(trial)) }}
      />
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
                name: trial.id,
                item: `${siteUrl}/trials/${trial.id}`,
              },
            ],
          }),
        }}
      />
      <Breadcrumbs
        items={[
          { label: "Find studies", href: "/search" },
          { label: trial.id },
        ]}
      />
      <div className="page-heading max-w-5xl">
        <div className="flex gap-3 items-center flex-wrap">
          <Status status={trial.status} />
          <Eyebrow>{trial.id}</Eyebrow>
        </div>
        <h1>{trial.title}</h1>
        <p>{trial.sponsor}</p>
        <div className="flex items-center gap-6 mt-5">
          <CompareButton id={trial.id} title={trial.title} />
          <SourceLink id={trial.id} />
        </div>
      </div>
      <div className="detail-layout">
        <div>
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8 p-6 border border-line bg-white rounded-lg">
            <Fact name="Study phase">
              {trial.phases.map(label).join(" / ") ||
                "Not applicable / not provided"}
            </Fact>
            <Fact name="Study type">
              {label(trial.studyType) || "Not provided"}
            </Fact>
            <Fact name="Enrollment">
              {trial.enrollment?.toLocaleString() || "Not provided"}{" "}
              {trial.enrollmentType ? `(${label(trial.enrollmentType)})` : ""}
            </Fact>
            <Fact name="Last registry update">
              {trial.updated || "Not provided"}
            </Fact>
          </dl>
          <section className="detail-section" id="overview">
            <h2>The study at a glance</h2>
            <StudyMarkdown>
              {trial.summary || "A summary has not been provided."}
            </StudyMarkdown>
            {trial.description && (
              <details className="mt-6">
                <summary className="text-link">
                  Read the detailed description
                </summary>
                <div className="mt-4">
                  <StudyMarkdown>{trial.description}</StudyMarkdown>
                </div>
              </details>
            )}
          </section>
          <section className="detail-section" id="eligibility">
            <h2>Participation criteria</h2>
            <p className="text-xs text-muted mb-5 leading-6">
              These are the criteria reported by the study team. Only that team
              can assess eligibility; these details do not establish that you
              qualify.
            </p>
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-6">
              <Fact name="Minimum age">{trial.minAge}</Fact>
              <Fact name="Maximum age">{trial.maxAge}</Fact>
              <Fact name="Sex">{label(trial.sex)}</Fact>
              <Fact name="Healthy volunteers">
                {trial.healthyVolunteers === undefined
                  ? "Not provided"
                  : trial.healthyVolunteers
                    ? "Accepted"
                    : "Not accepted"}
              </Fact>
            </dl>
            <StudyMarkdown>
              {trial.eligibility ||
                "Eligibility criteria have not been provided. Contact the study team."}
            </StudyMarkdown>
          </section>
          <section className="detail-section" id="design">
            <h2>Design & interventions</h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {trial.design.map((d, i) => (
                <span key={i} className="chip">
                  {label(d)}
                </span>
              ))}
            </div>
            {trial.interventions.length ? (
              trial.interventions.map((i, index) => (
                <div className="mb-5" key={index}>
                  <p className="eyebrow mb-2">{label(i.type)}</p>
                  <h3 className="font-semibold text-sm mb-2">{i.name}</h3>
                  <StudyMarkdown>{i.description}</StudyMarkdown>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted">No interventions listed.</p>
            )}
            <dl className="grid grid-cols-2 gap-6 mt-6">
              <Fact name="Study start">
                {trial.startDate || "Not provided"}
              </Fact>
              <Fact name="Study completion">
                {trial.completionDate || "Not provided"}
              </Fact>
            </dl>
          </section>
          <section className="detail-section" id="outcomes">
            <h2>What researchers are measuring</h2>
            {trial.outcomes.length ? (
              trial.outcomes.map((o, i) => (
                <div key={i} className="mb-5">
                  <h3 className="text-sm font-semibold mb-2">{o.measure}</h3>
                  <StudyMarkdown>{o.description}</StudyMarkdown>
                  {o.timeFrame && (
                    <p className="text-xs text-muted">
                      Time frame: {o.timeFrame}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted">
                Primary outcomes have not been provided.
              </p>
            )}
          </section>
          <section className="detail-section" id="locations">
            <h2>Study locations</h2>
            {trial.locations.some(
              (l) => l.lat !== undefined && l.lng !== undefined,
            ) && (
              <div className="mb-6">
                <DetailMap trial={trial} />
              </div>
            )}
            <ul className="grid sm:grid-cols-2 gap-4">
              {trial.locations.map((l, i) => (
                <li
                  key={i}
                  className="p-4 bg-white border border-line rounded-lg"
                >
                  <p className="text-sm font-semibold">{l.facility}</p>
                  <p className="text-xs text-muted mt-2">
                    {[l.city, l.country].filter(Boolean).join(", ")}
                  </p>
                  {l.status && (
                    <div className="mt-3">
                      <Status status={l.status} />
                    </div>
                  )}
                </li>
              ))}
            </ul>
            {!trial.locations.length && (
              <p className="text-sm text-muted">
                No public study locations are available.
              </p>
            )}
            <p className="text-xs text-muted mt-5">
              A study’s overall status can differ from the status of an
              individual site. Confirm current availability with the research
              team.
            </p>
          </section>
          <section className="detail-section" id="evidence">
            <h2>Related evidence</h2>
            <Suspense
              fallback={
                <p className="text-sm text-muted">
                  Looking up linked research…
                </p>
              }
            >
              <Evidence trial={trial} />
            </Suspense>
          </section>
        </div>
        <aside className="detail-aside">
          <Eyebrow>Explore this record</Eyebrow>
          <nav
            className="flex flex-col gap-4 my-6 text-sm"
            aria-label="Study sections"
          >
            {[
              ["overview", "Overview"],
              ["eligibility", "Participation criteria"],
              ["design", "Design & interventions"],
              ["outcomes", "Outcomes"],
              ["locations", "Locations"],
              ["evidence", "Related evidence"],
            ].map(([id, title]) => (
              <a href={`#${id}`} key={id} className="hover:text-teal">
                {title}
              </a>
            ))}
          </nav>
          <div className="border-t border-line pt-6">
            <h2 className="font-serif text-xl mb-3">Talk to the study team</h2>
            <p className="text-xs text-muted leading-6 mb-5">
              Ask about participation, availability, and what the study
              involves.
            </p>
            <p className="text-xs text-muted mb-4">
              Find current study-team contact details on ClinicalTrials.gov.
            </p>
            <a
              href={`https://clinicaltrials.gov/study/${trial.id}`}
              className="button w-full"
              target="_blank"
              rel="noreferrer"
            >
              Contact team on ClinicalTrials.gov <ArrowUpRight size={15} />
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
