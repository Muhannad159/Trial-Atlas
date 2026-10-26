"use client";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container py-20">
      <p className="eyebrow">A temporary interruption</p>
      <h1 className="editorial-title mt-4">We couldn’t load this page.</h1>
      <p className="text-muted text-sm my-6">
        The research services may be unavailable. Try again in a moment.
      </p>
      <button className="button button-primary" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
