'use client'

import { useState, useTransition } from 'react'
import { selectWorkspaceAction } from '@/app/workspace/actions'

type Props = {
  currentId: string
  organizations: Array<{
    id: string
    name: string
  }>
}

export default function WorkspaceSwitcher({ currentId, organizations }: Props) {
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)

  function submit(formData: FormData) {
    setMessage(null)
    startTransition(async () => {
      const result = await selectWorkspaceAction(formData)
      setMessage(result.ok ? 'تم تبديل مساحة العمل.' : result.message)
      if (result.ok) window.location.reload()
    })
  }

  if (organizations.length <= 1) return null

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <form action={submit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="min-w-0 flex-1">
          <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400">
            مساحة العمل الحالية
          </span>
          <select
            name="workspace_id"
            defaultValue={currentId}
            disabled={pending}
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-bold outline-none focus:border-orange-500"
          >
            {organizations.map((organization) => (
              <option key={organization.id} value={organization.id}>
                {organization.name}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-extrabold text-white hover:bg-black disabled:opacity-60"
        >
          {pending ? 'جاري التبديل…' : 'تبديل'}
        </button>
      </form>
      {message ? (
        <p role="status" className="mt-2 text-xs font-bold text-gray-500">
          {message}
        </p>
      ) : null}
    </div>
  )
}
