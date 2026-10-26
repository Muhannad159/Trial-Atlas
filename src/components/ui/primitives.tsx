import Link from "next/link";
import { ArrowUpRight, CircleAlert } from "lucide-react";
import { label } from "@/lib/validation/search";

export function Status({ status }: { status: string }) {
  return (
    <span className={`status ${status === "RECRUITING" ? "status-live" : ""}`}>
      <span aria-hidden="true" className="status-dot" />
      {label(status)}
    </span>
  );
}
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}
export function SourceLink({ id }: { id: string }) {
  return (
    <a
      href={`https://clinicaltrials.gov/study/${id}`}
      target="_blank"
      rel="noreferrer"
      className="text-link"
    >
      Official study record <ArrowUpRight size={15} aria-hidden="true" />
    </a>
  );
}
export function Unavailable({
  message = "The study registry is taking a little longer to respond. Please try again shortly.",
}: {
  message?: string;
}) {
  return (
    <div role="status" className="notice">
      <CircleAlert size={22} aria-hidden="true" />
      <div>
        <h3 className="font-semibold">
          Live studies are temporarily unavailable
        </h3>
        <p className="mt-2 text-sm text-muted">{message}</p>
        <Link href="/search" className="text-link mt-4">
          Try searching again <ArrowUpRight size={14} />
        </Link>
      </div>
    </div>
  );
}
export function Breadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <Link href="/">Home</Link>
      {items.map((item, i) => (
        <span key={i}>
          <span aria-hidden="true" className="mx-2">
            /
          </span>
          {item.href ? (
            <Link href={item.href}>{item.label}</Link>
          ) : (
            <span aria-current="page">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
export function Fact({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs text-muted mb-2">{name}</dt>
      <dd className="text-sm font-medium">{children}</dd>
    </div>
  );
}
