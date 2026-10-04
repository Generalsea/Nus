import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getWorkspaceContext } from '@/lib/workspace/context'
import ClientForm from '@/components/ClientForm'

export const dynamic = 'force-dynamic'

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const context = await getWorkspaceContext()

  if (!context.user) redirect('/login')
  if (!context.current) redirect('/today')

  const { id } = await params

  const { data: client, error } = await context.supabase
    .from('clients')
    .select('id, full_name, phone, email, preferred_contact_method, status, lead_source')
    .eq('id', id)
    .eq('organization_id', context.current.id)
    .maybeSingle()

  if (error || !client) notFound()

  return (
    <main className="min-h-screen px-6 py-8 md:px-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href={'/clients/' + client.id}
          className="text-sm font-bold text-orange-600 hover:underline"
        >
          ← العميل
        </Link>

        <section className="mt-5 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
            NUS · EDIT CLIENT
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">تعديل العميل</h1>
          <p className="mt-2 text-sm text-gray-500">{client.full_name}</p>
          <div className="mt-8">
            <ClientForm mode="edit" initial={client} />
          </div>
        </section>
      </div>
    </main>
  )
}
