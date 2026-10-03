'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { slugify } from '@/lib/domain/slug'
import { createWorkspaceSchema } from '@/lib/validation/workspace'

export default function WorkspaceOnboarding() {
  const router = useRouter()
  const supabase = createClient()
  const [name, setName] = useState('')
  const [timezone, setTimezone] = useState('Africa/Cairo')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError(null)

    const parsed = createWorkspaceSchema.safeParse({ name, slug: slugify(name), timezone })
    if (!parsed.success) {
      setError('أدخل اسم مساحة عمل صالحًا.')
      setPending(false)
      return
    }

    const { error: createError } = await supabase.rpc('create_organization', {
      p_name: parsed.data.name,
      p_slug: parsed.data.slug,
      p_timezone: parsed.data.timezone,
    })

    if (createError) {
      setError(createError.code === '23505' ? 'هذا الاسم المختصر مستخدم بالفعل. غيّر اسم مساحة العمل.' : 'تعذر إنشاء مساحة العمل. حاول مرة أخرى.')
      setPending(false)
      return
    }

    router.refresh()
  }

  return (
    <main className="min-h-screen px-6 py-16">
      <section className="mx-auto max-w-xl rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold text-orange-600">NUS · FOUNDATION</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">أنشئ مساحة عملك</h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">أول خطوة لتثبيت حدود بياناتك ومساحة العمل قبل إدخال العملاء والمواعيد.</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-bold">اسم النشاط</span>
            <input className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500" required minLength={2} maxLength={120} value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: عيادتي" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold">المنطقة الزمنية</span>
            <input className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500" value={timezone} onChange={(e) => setTimezone(e.target.value)} />
          </label>
          {error ? <div role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div> : null}
          <button type="submit" disabled={pending} className="w-full rounded-2xl bg-orange-600 px-5 py-3 font-extrabold text-white hover:bg-orange-700 disabled:opacity-60">{pending ? 'جاري الإنشاء…' : 'إنشاء مساحة العمل'}</button>
        </form>
      </section>
    </main>
  )
}
