import Link from "next/link";
import { Suspense } from "react";
import {
  ArrowUpRight,
  HeartPulse,
  Brain,
  Activity,
  ScanLine,
  ShieldCheck,
  Globe2,
  Database,
  Microscope,
} from "lucide-react";
import { AtlasIllustration } from "@/components/ui/atlas-illustration";
import { Eyebrow, Unavailable } from "@/components/ui/primitives";
import { SearchForm } from "@/features/search/search-form";
import { TrialCard } from "@/features/trials/trial-card";
import { searchTrials } from "@/lib/clinical-trials/client";
import { parseFilters } from "@/lib/validation/search";
import { conditionHubs, imagingHubs } from "@/config/hubs";
import { metadata as makeMetadata } from "@/lib/seo";
export const metadata = makeMetadata(
  "Clinical Trial Finder",
  "Explore clinical research with clear study details, interactive maps, and side-by-side comparisons. Public records from ClinicalTrials.gov.",
  "/",
);
async function RecentStudies() {
  const data = await searchTrials(parseFilters({})).catch(() => null);
  if (!data) return <Unavailable />;
  return (
    <div className="trial-grid">
      {data.studies.slice(0, 3).map((t) => (
        <TrialCard key={t.id} trial={t} />
      ))}
    </div>
  );
}
const icons = [Microscope, Activity, HeartPulse, Brain];
export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-top">
            <div>
              <Eyebrow>Clinical research, made clearer</Eyebrow>
              <h1>
                Every discovery starts
                <br />
                with <em>a possibility.</em>
              </h1>
              <p className="hero-description">
                Find clinical trials. Understand the details. See how they
                compare. Explore research that matters to you, wherever you are.
              </p>
            </div>
            <AtlasIllustration />
          </div>
          <SearchForm />
          <div className="hero-caption">
            <span>Start with a condition. No account needed.</span>
            <span className="flex gap-2 items-center">
              <Database size={13} />
              Study information from ClinicalTrials.gov
            </span>
          </div>
        </div>
      </section>
      <div className="trust-strip">
        <div className="container">
          <span className="eyebrow">Built for a clearer perspective</span>
          <span className="trust-item">
            <Globe2 size={18} className="text-teal" />
            Discover research worldwide
          </span>
          <span className="trust-item">
            <ScanLine size={18} className="text-teal" />
            Compare up to 3 studies
          </span>
          <span className="trust-item">
            <ShieldCheck size={18} className="text-teal" />
            No patient profiles
          </span>
        </div>
      </div>
      <section id="explore" className="section container">
        <div className="section-heading">
          <div>
            <Eyebrow>Find your starting point</Eyebrow>
            <h2 className="mt-3">Research that matters to you.</h2>
          </div>
          <Link href="/search" className="text-link">
            All studies <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="topic-grid">
          {conditionHubs.slice(0, 4).map((h, i) => {
            const Icon = icons[i];
            return (
              <Link
                href={`/conditions/${h.slug}`}
                key={h.slug}
                className="topic-card"
              >
                <span className="topic-icon">
                  <Icon size={20} strokeWidth={1.5} />
                </span>
                <ArrowUpRight className="topic-arrow" size={16} />
                <h3>{h.title}</h3>
                <p>{h.description}</p>
              </Link>
            );
          })}
        </div>
        <div className="flex gap-3 flex-wrap mt-5">
          {conditionHubs.slice(4).map((h) => (
            <Link className="chip" key={h.slug} href={`/conditions/${h.slug}`}>
              {h.title}
              <ArrowUpRight size={12} />
            </Link>
          ))}
        </div>
        <div className="imaging-band">
          <div className="flex gap-4 items-center">
            <ScanLine
              size={30}
              strokeWidth={1.3}
              className="text-teal shrink-0"
            />
            <div>
              <h3 className="font-serif text-xl">
                A closer look at medical imaging
              </h3>
              <p className="text-xs text-muted mt-1">
                Explore the technologies shaping clinical research.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 max-w-lg">
            {imagingHubs.map((h) => (
              <Link key={h.slug} href={`/topics/${h.slug}`} className="chip">
                {h.title}
                <ArrowUpRight size={12} />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="container section border-t border-line">
        <div className="section-heading">
          <div>
            <Eyebrow>From the registry</Eyebrow>
            <h2 className="mt-3">Recently updated. Worth exploring.</h2>
          </div>
          <Link href="/search" className="text-link">
            Browse studies <ArrowUpRight size={16} />
          </Link>
        </div>
        <p className="text-xs text-muted -mt-3 mb-7">
          Recruiting and not-yet-recruiting trials, ordered by registry update
          date. Inclusion is not a recommendation.
        </p>
        <Suspense
          fallback={
            <div className="trial-grid">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-80" />
              ))}
            </div>
          }
        >
          <RecentStudies />
        </Suspense>
      </section>
      <section className="container section">
        <div className="explain-band">
          <div>
            <p className="eyebrow !text-[#a8cdb4]">
              A little understanding goes a long way
            </p>
            <h2 className="editorial-title mt-4 mb-5">
              Research is complex.
              <br />
              Your next step can be clear.
            </h2>
            <p>
              Whether you’re exploring possibilities for yourself or reviewing
              evidence professionally, start with the same source—and go as deep
              as you need.
            </p>
            <Link
              href="/how-clinical-trials-work"
              className="text-link !text-white mt-6"
            >
              Understand clinical trials <ArrowUpRight size={15} />
            </Link>
          </div>
          <div>
            {[
              [
                "Find a starting point",
                "Search by condition, treatment, or location. Refine the results to explore relevant studies.",
              ],
              [
                "See the full picture",
                "Review the purpose, participation criteria, study sites, and linked research.",
              ],
              [
                "Take an informed next step",
                "Compare studies, download a summary, and contact the official research team.",
              ],
            ].map(([title, body], i) => (
              <div className="step" key={title}>
                <span className="step-number">0{i + 1}</span>
                <div>
                  <h3 className="text-sm font-medium mb-2">{title}</h3>
                  <p>{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
