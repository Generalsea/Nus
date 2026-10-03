const WORKSPACE_HASH_OFFSET = 14695981039346656037n
const WORKSPACE_HASH_PRIME = 1099511628211n

function fallbackWorkspaceSlug(value: string): string {
  let hash = WORKSPACE_HASH_OFFSET
  for (const char of value.trim()) {
    hash ^= BigInt(char.codePointAt(0) ?? 0)
    hash = BigInt.asUintN(64, hash * WORKSPACE_HASH_PRIME)
  }
  return 'workspace-' + hash.toString(36)
}

export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

export function slugifyWorkspaceName(value: string): string {
  return slugify(value) || fallbackWorkspaceSlug(value)
}
