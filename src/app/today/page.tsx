import Link from 'next/link'
import { redirect } from 'next/navigation'
import WorkspaceOnboarding from '@/components/WorkspaceOnboarding'
import WorkspaceSwitcher from '@/components/WorkspaceSwitcher'
import { getWorkspaceContext } from '@/lib/workspace/context'

export const dynamic = 'force-dynamic'

export default async function TodayPage() {
  const context = await getWorkspaceContext()

  if (!context.user) redirect('/login')
  if (!context.current) return <WorkspaceOnboarding />

  return (
    <main className="min-h-screen px-6 py-8 md:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-orange-600">NUS · TODAY</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight">صباحك يبدأ بما يهم</h1>
            <p className="mt-2 text-sm text-gray-500">
              Foundation complete. Client Core is now the working surface before appointments and follow-ups.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href="/clients" className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-extrabold text-white hover:bg-black">
              العملاء
            </Link>
            <form action="/auth/signout" method="post">
              <button className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-bold hover:border-gray-400">
                تسجيل الخروج
              </button>
            </form>
          </div>
        </header>

        <section className="space-y-4">
          <WorkspaceSwitcher
            currentId={context.current.id}
            organizations={context.organizations.map(({ id, name }) => ({ id, name }))}
          />

          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-3xl border border-orange-200 bg-orange-50 p-6">
              <p className="text-sm font-bold text-orange-700">مساحة العمل</p>
              <h2 className="mt-2 text-xl font-black">{context.current.name}</h2>
              <p className="mt-2 text-sm text-gray-600">Timezone: {context.current.timezone}</p>
            </article>

            <article className="rounded-3xl border border-gray-200 bg-white p-6">
              <p className="text-sm font-bold text-gray-500">الطبقة الحالية</p>
              <h2 className="mt-2 text-xl font-black">Client Core</h2>
              <p className="mt-2 text-sm text-gray-500">
                عملاء حقيقيون، ملاحظات، وسجل زمني دون بيانات وهمية.
              </p>
            </article>

            <article className="rounded-3xl border border-gray-200 bg-white p-6">
              <p className="text-sm font-bold text-gray-500">الخطوة التالية</p>
              <h2 className="mt-2 text-xl font-black">Appointment Core</h2>
              <p className="mt-2 text-sm text-gray-500">
                سنربط المواعيد بسجل العميل، لا كنظام منفصل.
              </p>
            </article>
          </div>
        </section>
      </div>
    </main>
  )
}
