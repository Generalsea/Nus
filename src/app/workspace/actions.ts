'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { WORKSPACE_COOKIE_NAME } from '@/lib/workspace/context'

export type WorkspaceActionResult =
  | { ok: true }
  | { ok: false; message: string }

export async function selectWorkspaceAction(
  formData: FormData,
): Promise<WorkspaceActionResult> {
  const requestedId = formData.get('workspace_id')
  const organizationId =
    typeof requestedId === 'string' ? requestedId.trim() : ''

  if (!organizationId) {
    return { ok: false, message: 'اختر مساحة عمل صالحة.' }
  }

  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { ok: false, message: 'يجب تسجيل الدخول أولًا.' }
  }

  const { data: membership, error } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('organization_id', organizationId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (error || !membership) {
    return { ok: false, message: 'مساحة العمل غير متاحة لهذا الحساب.' }
  }

  const cookieStore = await cookies()
  cookieStore.set({
    name: WORKSPACE_COOKIE_NAME,
    value: organizationId,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 180,
  })

  revalidatePath('/today')
  revalidatePath('/clients')
  return { ok: true }
}
