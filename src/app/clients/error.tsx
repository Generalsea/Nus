'use client'

export default function ClientsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="min-h-screen px-6 py-16">
      <section className="mx-auto max-w-2xl rounded-3xl border border-red-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold text-red-600">NUS · CLIENTS</p>
        <h1 className="mt-2 text-2xl font-black tracking-tight">تعذر تحميل مساحة العملاء</h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          حدث خطأ أثناء قراءة بيانات العملاء أو السجل. أعد المحاولة دون فقدان البيانات المدخلة.
        </p>
        {error.digest ? (
          <p className="mt-3 text-xs font-mono text-gray-400">مرجع الخطأ: {error.digest}</p>
        ) : null}
        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 rounded-2xl bg-gray-900 px-5 py-3 text-sm font-extrabold text-white hover:bg-black"
        >
          إعادة المحاولة
        </button>
      </section>
    </main>
  )
}
