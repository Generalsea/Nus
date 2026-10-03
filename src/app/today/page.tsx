import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import WorkspaceOnboarding from '@/components/WorkspaceOnboarding'

export const dynamic = 'force-dynamic'

export default async function TodayPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: memberships, error: membershipError } = await supabase
    .from('organization_members')
    .select('organization_id, role, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  if (membershipError) throw new Error('Unable to load workspace membership.')
  if (!memberships?.length) return <WorkspaceOnboarding />

  const ids = memberships.map((membership) => membership.organization_id)
  const { data: organizations, error } = await supabase
    .from('organizations')
    .select('id, name, timezone')
    .in('id', ids)
    .order('created_at', { ascending: true })

  if (error) throw new Error('Unable to load workspace.')
  const current = organizations?.[0]

  return (
    <main className="min-h-screen px-6 py-8 md:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-orange-600">NUS · TODAY</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight">صباحك يبدأ بما يهم</h1>
            <p className="mt-2 text-sm text-gray-500">Foundation milestone: الهوية ومساحة العمل جاهزتان قبل بناء العملاء والمواعيد.</p>
          </div>
          <form action="/auth/signout" method="post">
            <button className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-bold hover:border-gray-400">تسجيل الخروج</button>
          </form>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-3xl border border-orange-200 bg-orange-50 p-6">
            <p className="text-sm font-bold text-orange-700">مساحة العمل</p>
            <h2 className="mt-2 text-xl font-black">{current?.name ?? 'NUS'}</h2>
            <p className="mt-2 text-sm text-gray-600">Timezone: {current?.timezone ?? 'Africa/Cairo'}</p>
          </article>
          <article className="rounded-3xl border border-gray-200 bg-white p-6">
            <p className="text-sm font-bold text-gray-500">الموعد التالي</p>
            <h2 className="mt-2 text-xl font-black">سيأتي مع Appointment Core</h2>
            <p className="mt-2 text-sm text-gray-500">لن نزرع بيانات تجريبية في الإنتاج.</p>
          </article>
          <article className="rounded-3xl border border-gray-200 bg-white p-6">
            <p className="text-sm font-bold text-gray-500">الإجراءات المعرضة للضياع</p>
            <h2 className="mt-2 text-xl font-black">سيأتي مع Follow-up Engine</h2>
            <p className="mt-2 text-sm text-gray-500">هذه الواجهة لا تدّعي اكتمال وظائف لم تُبنَ بعد.</p>
          </article>
        </section>
      </div>
    </main>
  )
}
