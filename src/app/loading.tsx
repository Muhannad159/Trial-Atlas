export default function Loading() {
  return (
    <div className="container py-12" role="status" aria-label="Loading page">
      <div className="skeleton h-8 w-40 mb-8" />
      <div className="skeleton h-16 max-w-xl mb-8" />
      <div className="skeleton h-80" />
    </div>
  );
}
