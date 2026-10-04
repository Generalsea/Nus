export default function TodayLoading() {
  return (
    <main className="min-h-screen px-6 py-8 md:px-10" aria-busy="true" aria-live="polite">
      <div className="mx-auto max-w-6xl">
        <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
        <div className="mt-3 h-9 w-72 animate-pulse rounded bg-gray-200" />
        <div className="mt-2 h-5 max-w-2xl animate-pulse rounded bg-gray-100" />
        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <article key={index} className="rounded-3xl border border-gray-200 bg-white p-6">
              <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
              <div className="mt-3 h-6 w-40 animate-pulse rounded bg-gray-100" />
              <div className="mt-3 h-4 w-56 max-w-full animate-pulse rounded bg-gray-100" />
            </article>
          ))}
        </section>
      </div>
    </main>
  )
}
