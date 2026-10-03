import { NextResponse } from 'next/server'

export function privateRedirect(url: URL, status?: number) {
  const response = NextResponse.redirect(url, status === undefined ? undefined : { status })
  response.headers.set('Cache-Control', 'private, no-store')
  return response
}
