import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { safeInternalPath } from '@/lib/security/redirect'

function redirectNoStore(url: URL) {
  const response = NextResponse.redirect(url)
  response.headers.set('Cache-Control', 'private, no-store')
  return response
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next')
  const safeNext = safeInternalPath(next)

  if (!code) return redirectNoStore(new URL('/login?error=missing_code', url.origin))

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) return redirectNoStore(new URL('/login?error=auth_callback', url.origin))

  return redirectNoStore(new URL(safeNext, url.origin))
}
