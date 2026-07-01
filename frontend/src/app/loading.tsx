export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-[var(--muted)]" />
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] animate-pulse rounded-xl bg-[var(--muted)]" />
        ))}
      </div>
    </div>
  );
}
