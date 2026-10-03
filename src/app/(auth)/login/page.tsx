'use client'

import { FormEvent, Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { safeInternalPath } from '@/lib/security/redirect'

function LoginForm() {
  const searchParams = useSearchParams()
  const nextPath = safeInternalPath(searchParams.get('next'))
  const supabase = createClient()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  function switchMode(nextMode: 'login' | 'signup') {
    setMode(nextMode)
    setError(null)
    setMessage(null)
    setConfirmPassword('')
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError(null)
    setMessage(null)

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setError('كلمتا المرور غير متطابقتين.')
        setPending(false)
        return
      }

      const callbackUrl = new URL('/auth/callback', window.location.origin)
      callbackUrl.searchParams.set('next', nextPath)

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: callbackUrl.toString(),
        },
      })

      if (signUpError) {
        setError('تعذر إنشاء الحساب. راجع البيانات وحاول مرة أخرى.')
        setPending(false)
        return
      }

      if (data.session) {
        window.location.assign(nextPath)
        return
      }

      setMessage('تم إنشاء طلب الحساب. تحقق من بريدك الإلكتروني لإكمال التفعيل.')
      setPending(false)
      return
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      setError('تعذر تسجيل الدخول. راجع البيانات وحاول مرة أخرى.')
      setPending(false)
      return
    }

    window.location.assign(nextPath)
  }

  const isSignup = mode === 'signup'

  return (
    <main className="min-h-screen px-6 py-16">
      <section className="mx-auto max-w-md rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-8 shadow-sm">
        <div className="mb-8">
          <p className="mb-2 text-sm font-bold text-orange-600">NUS</p>
          <h1 className="text-3xl font-black tracking-tight">
            {isSignup ? 'أنشئ حسابك' : 'مرحبًا بك'}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {isSignup ? 'ابدأ مساحة عملك اليومية في NUS.' : 'ادخل إلى مساحة عملك اليومية.'}
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 rounded-2xl bg-gray-100 p-1" role="tablist" aria-label="حالة الحساب">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'login'}
            onClick={() => switchMode('login')}
            className={
              'rounded-xl px-3 py-2 text-sm font-extrabold transition ' +
              (mode === 'login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500')
            }
          >
            تسجيل الدخول
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'signup'}
            onClick={() => switchMode('signup')}
            className={
              'rounded-xl px-3 py-2 text-sm font-extrabold transition ' +
              (mode === 'signup' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500')
            }
          >
            إنشاء حساب
          </button>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-bold">البريد الإلكتروني</span>
            <input
              className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-orange-500"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold">كلمة المرور</span>
            <input
              className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-orange-500"
              type="password"
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              minLength={8}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {isSignup ? (
            <label className="block">
              <span className="mb-2 block text-sm font-bold">تأكيد كلمة المرور</span>
              <input
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-orange-500"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </label>
          ) : null}

          {error ? (
            <div role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          ) : null}

          {message ? (
            <div role="status" className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              {message}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-2xl bg-orange-600 px-5 py-3 font-extrabold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending
              ? isSignup
                ? 'جاري إنشاء الحساب…'
                : 'جاري الدخول…'
              : isSignup
                ? 'إنشاء الحساب'
                : 'تسجيل الدخول'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          {isSignup ? 'لديك حساب بالفعل؟' : 'ليس لديك حساب بعد؟'}{' '}
          <button
            type="button"
            onClick={() => switchMode(isSignup ? 'login' : 'signup')}
            className="font-extrabold text-orange-600 hover:underline"
          >
            {isSignup ? 'تسجيل الدخول' : 'إنشاء حساب'}
          </button>
        </p>
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
