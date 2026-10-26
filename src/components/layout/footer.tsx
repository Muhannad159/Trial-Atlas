import Link from "next/link";
import { Compass, ArrowUpRight } from "lucide-react";
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <Link href="/" className="brand">
              <Compass size={25} />
              TrialAtlas
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-7 text-muted">
              A clearer view of clinical research.
              <br />
              Public information. Open possibilities.
            </p>
          </div>
          <div>
            <p className="eyebrow mb-4">Explore</p>
            <Link href="/search">Find a trial</Link>
            <Link href="/compare">Compare studies</Link>
            <Link href="/how-clinical-trials-work">Understanding trials</Link>
          </div>
          <div>
            <p className="eyebrow mb-4">Our approach</p>
            <Link href="/about">About TrialAtlas</Link>
            <Link href="/methodology">Sources & methodology</Link>
            <a
              href="https://clinicaltrials.gov"
              target="_blank"
              rel="noreferrer"
            >
              ClinicalTrials.gov <ArrowUpRight size={12} className="inline" />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            For research discovery. Study teams determine eligibility.
            Information may change. Study data: ClinicalTrials.gov (NLM/NIH).
          </p>
          <div className="flex flex-wrap gap-5">
            <Link href="/privacy">Privacy</Link>
            <Link href="/disclaimer">Disclaimer</Link>
            <Link href="/data-terms">Data terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
