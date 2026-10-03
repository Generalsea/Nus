import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ClientForm from '@/components/ClientForm'

export const dynamic = 'force-dynamic'

export default async function NewClientPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: membership } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (!membership) redirect('/today')

  return (
    <main className="min-h-screen px-6 py-8 md:px-10">
      <div className="mx-auto max-w-3xl">
        <Link href="/clients" className="text-sm font-bold text-orange-600 hover:underline">
          ← العملاء
        </Link>

        <section className="mt-5 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
            NUS · NEW CLIENT
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">إضافة عميل</h1>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            سجّل الحد الأدنى الذي يجعل الموعد والمتابعة لاحقًا أكثر فاعلية.
          </p>
          <div className="mt-8">
            <ClientForm mode="create" />
          </div>
        </section>
      </div>
    </main>
  )
}
