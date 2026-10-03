import { createClient } from '@/lib/supabase/server'
import { privateRedirect } from '@/lib/security/response'

export async function POST(request: Request) {
  const supabase = await createClient()
  await supabase.auth.signOut()
  return privateRedirect(new URL('/login', request.url), 303)
}
