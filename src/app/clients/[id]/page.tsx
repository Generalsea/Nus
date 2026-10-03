import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import {
  CLIENT_STATUS_LABELS,
  CONTACT_METHOD_LABELS,
  type ClientStatus,
  type PreferredContactMethod,
} from '@/lib/domain/client'
import { getWorkspaceContext } from '@/lib/workspace/context'
import ClientNoteForm from '@/components/ClientNoteForm'

export const dynamic = 'force-dynamic'

const eventLabels: Record<string, string> = {
  client_created: 'تم إنشاء العميل',
  client_updated: 'تم تحديث بيانات العميل',
  client_note_added: 'تمت إضافة ملاحظة',
  client_note_updated: 'تم تحديث ملاحظة',
}

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const context = await getWorkspaceContext()

  if (!context.user) redirect('/login')
  if (!context.current) redirect('/today')

  const { id } = await params

  const [clientResult, notesResult, eventsResult] = await Promise.all([
    context.supabase
      .from('clients')
      .select(
        'id, organization_id, full_name, phone, email, preferred_contact_method, status, lead_source, created_at, updated_at, archived_at',
      )
      .eq('id', id)
      .eq('organization_id', context.current.id)
      .maybeSingle(),
    context.supabase
      .from('client_notes')
      .select('id, body, created_at, updated_at')
      .eq('client_id', id)
      .eq('organization_id', context.current.id)
      .order('created_at', { ascending: false })
      .limit(100),
    context.supabase
      .from('activity_events')
      .select('id, event_name, entity_type, entity_id, created_at')
      .eq('organization_id', context.current.id)
      .eq('entity_type', 'client')
      .eq('entity_id', id)
      .order('created_at', { ascending: false })
      .limit(100),
  ])

  if (clientResult.error || !clientResult.data) notFound()
  if (notesResult.error || eventsResult.error) {
    throw new Error('تعذر تحميل سجل العميل.')
  }

  const noteIds = (notesResult.data ?? []).map((note) => note.id)
  let events = eventsResult.data ?? []

  if (noteIds.length > 0) {
    const noteEvents = await context.supabase
      .from('activity_events')
      .select('id, event_name, entity_type, entity_id, created_at')
      .eq('organization_id', context.current.id)
      .eq('entity_type', 'client_note')
      .in('entity_id', noteIds)
      .order('created_at', { ascending: false })
      .limit(100)

    if (noteEvents.error) throw new Error('تعذر تحميل نشاط ملاحظات العميل.')
    events = [...events, ...(noteEvents.data ?? [])]
  }

  const client = clientResult.data
  const status = client.status as ClientStatus
  const contactMethod =
    client.preferred_contact_method as PreferredContactMethod | null

  const timeline = [
    ...events.map((event) => ({
      id: 'event-' + event.id,
      kind: 'event' as const,
      at: event.created_at,
      title: eventLabels[event.event_name] ?? 'تم تسجيل نشاط',
      body: null,
    })),
    ...(notesResult.data ?? []).map((note) => ({
      id: 'note-' + note.id,
      kind: 'note' as const,
      at: note.created_at,
      title: 'ملاحظة',
      body: note.body,
    })),
  ].sort((a, b) => b.at.localeCompare(a.at))

  return (
    <main className="min-h-screen px-6 py-8 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-4 text-sm font-bold">
            <Link href="/clients" className="text-orange-600 hover:underline">
              ← العملاء
            </Link>
            <Link
              href={'/clients/' + client.id + '/edit'}
              className="text-gray-500 hover:text-gray-900"
            >
              تعديل
            </Link>
          </div>
        </div>

        <section className="mt-5 grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
          <article className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                  CLIENT
                </p>
                <h1 className="mt-2 text-3xl font-black tracking-tight">
                  {client.full_name}
                </h1>
              </div>
              <span
                className={
                  'rounded-full px-3 py-1 text-xs font-extrabold ' +
                  (status === 'active'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-gray-100 text-gray-600')
                }
              >
                {CLIENT_STATUS_LABELS[status]}
              </span>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-gray-50 p-4">
                <div className="text-xs font-bold text-gray-400">الهاتف</div>
                <div className="mt-1 font-bold">{client.phone || 'غير مضاف'}</div>
              </div>

              <div className="rounded-2xl bg-gray-50 p-4">
                <div className="text-xs font-bold text-gray-400">
                  البريد الإلكتروني
                </div>
                <div className="mt-1 break-all font-bold">
                  {client.email || 'غير مضاف'}
                </div>
              </div>

              <div className="rounded-2xl bg-gray-50 p-4">
                <div className="text-xs font-bold text-gray-400">
                  قناة التواصل
                </div>
                <div className="mt-1 font-bold">
                  {contactMethod
                    ? CONTACT_METHOD_LABELS[contactMethod]
                    : 'غير محددة'}
                </div>
              </div>

              <div className="rounded-2xl bg-gray-50 p-4">
                <div className="text-xs font-bold text-gray-400">المصدر</div>
                <div className="mt-1 font-bold">
                  {client.lead_source || 'غير محدد'}
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {client.phone ? (
                <a
                  href={'tel:' + client.phone}
                  className="rounded-2xl bg-orange-600 px-4 py-3 text-sm font-extrabold text-white hover:bg-orange-700"
                >
                  اتصال
                </a>
              ) : null}
              {client.email ? (
                <a
                  href={'mailto:' + client.email}
                  className="rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm font-extrabold hover:border-gray-400"
                >
                  بريد
                </a>
              ) : null}
            </div>
          </article>

          <article className="rounded-3xl border border-orange-200 bg-orange-50 p-6 md:p-8">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-700">
              NEXT LAYER
            </p>
            <h2 className="mt-2 text-2xl font-black">
              سيأتي الموعد والمتابعة فوق هذا السجل.
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-700">
              العميل هنا هو الذاكرة الأساسية. المواعيد والإجراءات القادمة ستبني فوقه
              بدل تكرار بيانات الشخص في كل شاشة.
            </p>
          </article>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
          <article className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black">ملاحظات</h2>
            <p className="mt-1 text-sm text-gray-500">
              ملاحظات العمل اليومية التي تحتاج أن تبقى مع العميل.
            </p>
            <div className="mt-5">
              <ClientNoteForm clientId={client.id} />
            </div>
          </article>

          <article className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-baseline justify-between gap-3">
              <div>
                <h2 className="text-xl font-black">الخط الزمني</h2>
                <p className="mt-1 text-sm text-gray-500">
                  التغييرات والملاحظات محفوظة كسجل قابل للرجوع.
                </p>
              </div>
              <span className="text-xs font-bold text-gray-400">
                {timeline.length} نشاط
              </span>
            </div>

            {timeline.length === 0 ? (
              <div className="mt-6 rounded-2xl bg-gray-50 px-4 py-5 text-sm text-gray-500">
                لا يوجد نشاط مسجل بعد.
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {timeline.map((item) => (
                  <div
                    key={item.id}
                    className="relative rounded-2xl border border-gray-100 bg-gray-50 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-extrabold">{item.title}</span>
                      <time
                        dateTime={item.at}
                        className="text-xs font-bold text-gray-400"
                      >
                        {new Date(item.at).toLocaleString('ar-EG', {
                          timeZone: context.current.timezone,
                        })}
                      </time>
                    </div>
                    {item.body ? (
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                        {item.body}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </article>
        </section>
      </div>
    </main>
  )
}
