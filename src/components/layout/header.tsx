import Link from "next/link";
import { Compass, ArrowUpRight } from "lucide-react";
export function Header() {
  return (
    <header className="site-header">
      <div className="container flex h-20 items-center justify-between gap-4">
        <Link href="/" className="brand" aria-label="TrialAtlas home">
          <span className="brand-icon">
            <Compass size={25} strokeWidth={1.5} />
          </span>
          Trial<span className="font-normal">Atlas</span>
          <span className="brand-beta">BETA</span>
        </Link>
        <nav aria-label="Main navigation" className="main-nav">
          <Link href="/search">Find a trial</Link>
          <Link href="/#explore">Explore topics</Link>
          <Link href="/how-clinical-trials-work">How it works</Link>
        </nav>
        <Link href="/search" className="header-cta">
          Explore studies <ArrowUpRight size={15} />
        </Link>
      </div>
    </header>
  );
}
