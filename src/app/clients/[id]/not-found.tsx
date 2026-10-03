import Link from 'next/link'

export default function ClientNotFound() {
  return (
    <main className="min-h-screen px-6 py-16">
      <section className="mx-auto max-w-xl rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-bold text-orange-600">NUS · CLIENT</p>
        <h1 className="mt-2 text-2xl font-black tracking-tight">العميل غير متاح</h1>
        <p className="mt-3 text-sm leading-6 text-gray-500">
          قد يكون الرابط غير صحيح أو أن العميل لا ينتمي إلى مساحة العمل الحالية.
        </p>
        <Link
          href="/clients"
          className="mt-6 inline-flex rounded-2xl bg-orange-600 px-5 py-3 text-sm font-extrabold text-white hover:bg-orange-700"
        >
          العودة إلى العملاء
        </Link>
      </section>
    </main>
  )
}
