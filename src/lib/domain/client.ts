export type ClientStatus = 'active' | 'archived'
export type PreferredContactMethod = 'phone' | 'whatsapp' | 'email' | 'other'

export const CLIENT_STATUS_LABELS: Record<ClientStatus, string> = {
  active: 'نشط',
  archived: 'مؤرشف',
}

export const CONTACT_METHOD_LABELS: Record<PreferredContactMethod, string> = {
  phone: 'هاتف',
  whatsapp: 'واتساب',
  email: 'بريد إلكتروني',
  other: 'أخرى',
}

export function normalizeClientSearch(value: string): string {
  return value
    .trim()
    .replace(/[,%*_()'"\\]/g, ' ')
    .replace(/\s+/g, ' ')
    .slice(0, 80)
    .trim()
}

export function archiveTimestamp(status: ClientStatus, now: string): string | null {
  return status === 'archived' ? now : null
}
