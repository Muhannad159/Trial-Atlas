import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container py-20">
      <p className="eyebrow">404 · Page not found</p>
      <h1 className="editorial-title mt-4">
        Let’s find another starting point.
      </h1>
      <p className="text-sm text-muted my-6">
        This page or study identifier could not be found.
      </p>
      <Link href="/search" className="button button-primary">
        Find studies
      </Link>
    </div>
  );
}
