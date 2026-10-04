'use client'

import Link from 'next/link'

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="min-h-screen px-6 py-16">
      <section className="mx-auto max-w-2xl rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-bold text-red-600">NUS · ERROR</p>
        <h1 className="mt-2 text-2xl font-black tracking-tight">حدث خطأ غير متوقع</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-600">
          لم نتمكن من إكمال هذه الصفحة. أعد المحاولة، أو ارجع إلى المسار الآمن بدل عرض تفاصيل داخلية عن الخطأ.
        </p>
        {error.digest ? (
          <p className="mt-3 text-xs font-mono text-gray-400">مرجع الخطأ: {error.digest}</p>
        ) : null}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-2xl bg-gray-900 px-5 py-3 text-sm font-extrabold text-white hover:bg-black"
          >
            إعادة المحاولة
          </button>
          <Link
            href="/login"
            className="rounded-2xl border border-gray-300 bg-white px-5 py-3 text-sm font-extrabold hover:border-gray-400"
          >
            تسجيل الدخول
          </Link>
        </div>
      </section>
    </main>
  )
}
