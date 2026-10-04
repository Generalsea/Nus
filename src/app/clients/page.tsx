import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getWorkspaceContext } from '@/lib/workspace/context'
import { normalizeClientSearch } from '@/lib/domain/client'

export const dynamic = 'force-dynamic'

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const context = await getWorkspaceContext()

  if (!context.user) redirect('/login')
  if (!context.current) redirect('/today')

  const params = await searchParams
  const query = normalizeClientSearch(params.q ?? '')

  let builder = context.supabase
    .from('clients')
    .select('id, full_name, phone, email, preferred_contact_method, status, lead_source, updated_at')
    .eq('organization_id', context.current.id)
    .order('updated_at', { ascending: false })
    .limit(50)

  if (query) {
    builder = builder.or('full_name.ilike.%' + query + '%,phone.ilike.%' + query + '%,email.ilike.%' + query + '%')
  }

  const { data: clients, error } = await builder
  if (error) throw new Error('تعذر تحميل العملاء.')

  return (
    <main className="min-h-screen px-6 py-8 md:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link href="/today" className="text-sm font-bold text-orange-600 hover:underline">
              ← اليوم
            </Link>
            <p className="mt-3 text-xs font-black uppercase tracking-[0.2em] text-gray-400">
              NUS · CLIENT CORE
            </p>
            <h1 className="mt-1 text-3xl font-black tracking-tight">العملاء</h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-500">
              سجل واضح لكل شخص يحتاج متابعة أو موعدًا أو إجراءً قادمًا.
            </p>
          </div>

          <Link
            href="/clients/new"
            className="rounded-2xl bg-orange-600 px-5 py-3 font-extrabold text-white hover:bg-orange-700"
          >
            + عميل جديد
          </Link>
        </header>

        <form method="get" className="mb-6 flex flex-col gap-3 md:flex-row">
          <label className="flex-1">
            <span className="sr-only">بحث في العملاء</span>
            <input
              name="q"
              defaultValue={query}
              placeholder="ابحث بالاسم أو الهاتف أو البريد الإلكتروني"
              className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </label>
          <button
            type="submit"
            className="rounded-2xl border border-gray-300 bg-white px-5 py-3 font-bold hover:border-gray-400"
          >
            بحث
          </button>
          {query ? (
            <Link href="/clients" className="rounded-2xl px-4 py-3 text-center text-sm font-bold text-gray-500 hover:bg-gray-100">
              مسح
            </Link>
          ) : null}
        </form>

        {clients.length === 0 ? (
          <section className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <div className="text-4xl">◌</div>
            <h2 className="mt-3 text-xl font-black">
              {query ? 'لا توجد نتائج مطابقة' : 'لا يوجد عملاء بعد'}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              {query
                ? 'جرّب اسمًا أو رقمًا أو بريدًا مختلفًا.'
                : 'ابدأ بأول عميل حقيقي. لن نزرع بيانات تجريبية في مساحة عملك.'}
            </p>
            {!query ? (
              <Link
                href="/clients/new"
                className="mt-5 inline-flex rounded-2xl bg-orange-600 px-5 py-3 font-extrabold text-white"
              >
                إضافة أول عميل
              </Link>
            ) : null}
          </section>
        ) : (
          <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-5 py-4 text-sm font-bold text-gray-500">
              {clients.length} عميل ظاهر
            </div>
            <div className="divide-y divide-gray-100">
              {clients.map((client) => (
                <Link
                  key={client.id}
                  href={'/clients/' + client.id}
                  className="block px-5 py-5 transition hover:bg-gray-50"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="truncate text-lg font-black">{client.full_name}</h2>
                      <p className="mt-1 text-sm text-gray-500">
                        {[client.phone, client.email].filter(Boolean).join(' · ') ||
                          'لا توجد بيانات اتصال إضافية'}
                      </p>
                    </div>

                    <div className="text-left text-xs text-gray-400">
                      <div className="font-bold">
                        {client.status === 'active' ? 'نشط' : 'مؤرشف'}
                      </div>
                      {client.lead_source ? (
                        <div className="mt-1">المصدر: {client.lead_source}</div>
                      ) : null}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
