'use client'

import { FormEvent, Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { safeInternalPath } from '@/lib/security/redirect'

function LoginForm() {
  const searchParams = useSearchParams()
  const nextPath = safeInternalPath(searchParams.get('next'))
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError(null)

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      setError('تعذر تسجيل الدخول. راجع البيانات وحاول مرة أخرى.')
      setPending(false)
      return
    }

    window.location.assign(nextPath)
  }

  return (
    <main className="min-h-screen px-6 py-16">
      <section className="mx-auto max-w-md rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-8 shadow-sm">
        <div className="mb-8">
          <p className="mb-2 text-sm font-bold text-orange-600">NUS</p>
          <h1 className="text-3xl font-black tracking-tight">مرحبًا بك</h1>
          <p className="mt-2 text-sm text-gray-500">ادخل إلى مساحة عملك اليومية.</p>
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-bold">البريد الإلكتروني</span>
            <input
              className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-orange-500"
              type="email" autoComplete="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold">كلمة المرور</span>
            <input
              className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-orange-500"
              type="password" autoComplete="current-password" required value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {error ? <div role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div> : null}
          <button type="submit" disabled={pending} className="w-full rounded-2xl bg-orange-600 px-5 py-3 font-extrabold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60">
            {pending ? 'جاري الدخول…' : 'تسجيل الدخول'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen px-6 py-16" aria-busy="true">جارٍ التحميل…</main>}>
      <LoginForm />
    </Suspense>
  )
}
