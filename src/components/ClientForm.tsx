'use client'

import { FormEvent, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Database } from '@/lib/supabase/database'
import {
  createClientAction,
  updateClientAction,
  type ClientActionResult,
} from '@/app/clients/actions'
import { CLIENT_STATUS_LABELS, CONTACT_METHOD_LABELS } from '@/lib/domain/client'

type ClientRow = Database['public']['Tables']['clients']['Row']

type Props = {
  mode: 'create' | 'edit'
  initial?: Partial<ClientRow>
}

const contactMethods = Object.keys(CONTACT_METHOD_LABELS) as Array<keyof typeof CONTACT_METHOD_LABELS>
const statuses = Object.keys(CLIENT_STATUS_LABELS) as Array<keyof typeof CLIENT_STATUS_LABELS>

export default function ClientForm({ mode, initial }: Props) {
  const router = useRouter()
  const [result, setResult] = useState<ClientActionResult | null>(null)
  const [pending, startTransition] = useTransition()

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setResult(null)
    const formData = new FormData(event.currentTarget)

    startTransition(async () => {
      const response =
        mode === 'create'
          ? await createClientAction(formData)
          : await updateClientAction(formData)

      setResult(response)
      if (response.ok) {
        router.push('/clients/' + response.clientId)
      }
    })
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      {mode === 'edit' ? (
        <input type="hidden" name="client_id" value={initial?.id ?? ''} />
      ) : null}

      <label className="block">
        <span className="mb-2 block text-sm font-bold">اسم العميل *</span>
        <input
          name="full_name"
          required
          minLength={2}
          maxLength={160}
          defaultValue={initial?.full_name ?? ''}
          className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          placeholder="مثال: أحمد محمد"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-bold">رقم الهاتف</span>
          <input
            name="phone"
            type="tel"
            maxLength={32}
            defaultValue={initial?.phone ?? ''}
            className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            placeholder="01xxxxxxxxx"
            inputMode="tel"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold">البريد الإلكتروني</span>
          <input
            name="email"
            type="email"
            maxLength={254}
            defaultValue={initial?.email ?? ''}
            className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            placeholder="name@example.com"
            inputMode="email"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-bold">قناة التواصل المفضلة</span>
          <select
            name="preferred_contact_method"
            defaultValue={initial?.preferred_contact_method ?? ''}
            className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-orange-500"
          >
            <option value="">لم تُحدد</option>
            {contactMethods.map((method) => (
              <option key={method} value={method}>
                {CONTACT_METHOD_LABELS[method]}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold">مصدر العميل</span>
          <input
            name="lead_source"
            maxLength={80}
            defaultValue={initial?.lead_source ?? ''}
            className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-orange-500"
            placeholder="مثال: إحالة، إعلان، موقع"
          />
        </label>
      </div>

      {mode === 'edit' ? (
        <label className="block">
          <span className="mb-2 block text-sm font-bold">حالة العميل</span>
          <select
            name="status"
            defaultValue={initial?.status ?? 'active'}
            className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-orange-500"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {CLIENT_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      {result?.ok === false ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
        >
          {result.message}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-2xl bg-orange-600 px-5 py-3 font-extrabold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? 'جاري الحفظ…' : mode === 'create' ? 'إنشاء العميل' : 'حفظ التعديلات'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-2xl border border-gray-300 bg-white px-5 py-3 font-bold hover:border-gray-400"
        >
          رجوع
        </button>
      </div>
    </form>
  )
}
