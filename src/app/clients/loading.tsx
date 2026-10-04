export default function ClientsLoading() {
  return (
    <main className="min-h-screen px-6 py-8 md:px-10" aria-busy="true" aria-live="polite">
      <div className="mx-auto max-w-6xl">
        <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
        <div className="mt-3 h-9 w-48 animate-pulse rounded bg-gray-200" />
        <div className="mt-2 h-5 max-w-xl animate-pulse rounded bg-gray-100" />
        <section className="mt-8 overflow-hidden rounded-3xl border border-gray-200 bg-white">
          <div className="divide-y divide-gray-100">
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="px-5 py-5">
                <div className="h-5 w-56 animate-pulse rounded bg-gray-200" />
                <div className="mt-2 h-4 w-80 max-w-full animate-pulse rounded bg-gray-100" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
