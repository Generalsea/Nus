import { createClient } from '@/lib/supabase/server'
import { safeInternalPath } from '@/lib/security/redirect'
import { privateRedirect } from '@/lib/security/response'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next')
  const safeNext = safeInternalPath(next)

  if (!code) return privateRedirect(new URL('/login?error=missing_code', url.origin))

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) return privateRedirect(new URL('/login?error=auth_callback', url.origin))

  return privateRedirect(new URL(safeNext, url.origin))
}
