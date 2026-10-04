import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { WORKSPACE_COOKIE_NAME } from '@/lib/workspace/context'
import { privateRedirect } from '@/lib/security/response'

export async function POST(request: Request) {
  const supabase = await createClient()
  await supabase.auth.signOut()
  const cookieStore = await cookies()
  cookieStore.delete(WORKSPACE_COOKIE_NAME)
  return privateRedirect(new URL('/login', request.url), 303)
}
