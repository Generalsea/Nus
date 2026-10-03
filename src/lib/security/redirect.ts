export function safeInternalPath(value: string | null | undefined, fallback = '/today'): string {
  if (!value || !value.startsWith('/')) return fallback

  let decoded = value
  try {
    decoded = decodeURIComponent(value)
  } catch {
    return fallback
  }

  if (
    value.startsWith('//') ||
    decoded.startsWith('//') ||
    value.includes('\\') ||
    decoded.includes('\\') ||
    /[\\u0000-\\u001F\\u007F]/.test(decoded)
  ) {
    return fallback
  }

  try {
    const base = 'https://nus.invalid'
    const url = new URL(value, base)
    if (url.origin !== base) return fallback
    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return fallback
  }
}
