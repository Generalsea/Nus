'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { archiveTimestamp } from '@/lib/domain/client'
import { clientNoteSchema, clientSchema } from '@/lib/validation/client'

export type ClientActionResult =
  | { ok: true; clientId: string }
  | { ok: false; message: string }

async function getUserAndWorkspace() {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) return { supabase, user: null, organizationId: null }

  const { data: membership, error } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (error || !membership) return { supabase, user, organizationId: null }

  return { supabase, user, organizationId: membership.organization_id }
}

function textValue(value: FormDataEntryValue | null): string {
  return typeof value === 'string' ? value : ''
}

function genericClientWriteError(errorCode?: string): ClientActionResult {
  if (errorCode === '42501') {
    return { ok: false, message: 'ليس لديك صلاحية لتنفيذ هذا الإجراء.' }
  }
  if (errorCode === '23514') {
    return { ok: false, message: 'بعض البيانات لا تتوافق مع قواعد العميل.' }
  }
  return { ok: false, message: 'تعذر حفظ بيانات العميل. حاول مرة أخرى.' }
}

export async function createClientAction(formData: FormData): Promise<ClientActionResult> {
  const { supabase, user, organizationId } = await getUserAndWorkspace()
  if (!user) return { ok: false, message: 'يجب تسجيل الدخول أولًا.' }
  if (!organizationId) return { ok: false, message: 'أنشئ مساحة عمل أولًا.' }

  const parsed = clientSchema.safeParse({
    full_name: textValue(formData.get('full_name')),
    phone: textValue(formData.get('phone')),
    email: textValue(formData.get('email')),
    preferred_contact_method: textValue(formData.get('preferred_contact_method')) || undefined,
    status: 'active',
    lead_source: textValue(formData.get('lead_source')),
  })

  if (!parsed.success) return { ok: false, message: 'راجع بيانات العميل وأكمل الحقول بشكل صحيح.' }

  const { data, error } = await supabase
    .from('clients')
    .insert({
      organization_id: organizationId,
      created_by_user_id: user.id,
      full_name: parsed.data.full_name,
      phone: parsed.data.phone ?? null,
      email: parsed.data.email ?? null,
      preferred_contact_method: parsed.data.preferred_contact_method ?? null,
      status: 'active',
      lead_source: parsed.data.lead_source ?? null,
      archived_at: null,
    })
    .select('id')
    .single()

  if (error || !data) return genericClientWriteError(error?.code)

  revalidatePath('/clients')
  return { ok: true, clientId: data.id }
}

export async function updateClientAction(formData: FormData): Promise<ClientActionResult> {
  const { supabase, user, organizationId } = await getUserAndWorkspace()
  if (!user) return { ok: false, message: 'يجب تسجيل الدخول أولًا.' }
  if (!organizationId) return { ok: false, message: 'مساحة العمل غير متاحة.' }

  const clientId = textValue(formData.get('client_id'))
  const status = textValue(formData.get('status')) || 'active'

  const parsed = clientSchema.safeParse({
    full_name: textValue(formData.get('full_name')),
    phone: textValue(formData.get('phone')),
    email: textValue(formData.get('email')),
    preferred_contact_method: textValue(formData.get('preferred_contact_method')) || undefined,
    status,
    lead_source: textValue(formData.get('lead_source')),
  })

  if (!clientId || !parsed.success) {
    return { ok: false, message: 'بيانات التعديل غير صالحة.' }
  }

  const archivedAt = archiveTimestamp(parsed.data.status, new Date().toISOString())

  const { data, error } = await supabase
    .from('clients')
    .update({
      full_name: parsed.data.full_name,
      phone: parsed.data.phone ?? null,
      email: parsed.data.email ?? null,
      preferred_contact_method: parsed.data.preferred_contact_method ?? null,
      status: parsed.data.status,
      lead_source: parsed.data.lead_source ?? null,
      archived_at: archivedAt,
    })
    .eq('id', clientId)
    .eq('organization_id', organizationId)
    .select('id')
    .maybeSingle()

  if (error || !data) return genericClientWriteError(error?.code)

  revalidatePath('/clients')
  revalidatePath('/clients/' + clientId)
  revalidatePath('/clients/' + clientId + '/edit')
  return { ok: true, clientId: data.id }
}

export async function addClientNoteAction(formData: FormData): Promise<ClientActionResult> {
  const { supabase, user, organizationId } = await getUserAndWorkspace()
  if (!user) return { ok: false, message: 'يجب تسجيل الدخول أولًا.' }
  if (!organizationId) return { ok: false, message: 'مساحة العمل غير متاحة.' }

  const clientId = textValue(formData.get('client_id'))
  const parsed = clientNoteSchema.safeParse({ body: textValue(formData.get('body')) })

  if (!clientId || !parsed.success) {
    return { ok: false, message: 'أدخل ملاحظة صالحة.' }
  }

  const { data: client, error: clientError } = await supabase
    .from('clients')
    .select('id, organization_id')
    .eq('id', clientId)
    .eq('organization_id', organizationId)
    .maybeSingle()

  if (clientError || !client) {
    return { ok: false, message: 'العميل غير متاح لمساحة العمل الحالية.' }
  }

  const { error } = await supabase.from('client_notes').insert({
    organization_id: client.organization_id,
    client_id: client.id,
    author_user_id: user.id,
    body: parsed.data.body,
  })

  if (error) return genericClientWriteError(error.code)

  revalidatePath('/clients/' + clientId)
  return { ok: true, clientId }
}
