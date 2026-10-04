'use client'

import { FormEvent, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { addClientNoteAction, type ClientActionResult } from '@/app/clients/actions'

export default function ClientNoteForm({ clientId }: { clientId: string }) {
  const router = useRouter()
  const [result, setResult] = useState<ClientActionResult | null>(null)
  const [pending, startTransition] = useTransition()
  const [body, setBody] = useState('')

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setResult(null)
    const formData = new FormData(event.currentTarget)

    startTransition(async () => {
      const response = await addClientNoteAction(formData)
      setResult(response)
      if (response.ok) {
        setBody('')
        router.refresh()
      }
    })
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input type="hidden" name="client_id" value={clientId} />
      <label className="block">
        <span className="mb-2 block text-sm font-bold">أضف ملاحظة</span>
        <textarea
          name="body"
          required
          maxLength={5000}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          rows={5}
          className="w-full resize-y rounded-2xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          placeholder="سجل ما يهمك أن تتذكره عن هذا العميل…"
        />
      </label>

      {result?.ok === false ? (
        <div role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {result.message}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={pending || body.trim().length === 0}
        className="rounded-2xl bg-gray-900 px-5 py-3 font-extrabold text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? 'جاري الحفظ…' : 'حفظ الملاحظة'}
      </button>
    </form>
  )
}
