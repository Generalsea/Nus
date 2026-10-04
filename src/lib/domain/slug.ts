const WORKSPACE_HASH_PRIME = 16777619

function hashWorkspaceText(value: string, seed: number): number {
  let hash = seed >>> 0
  for (const char of value.trim()) {
    hash ^= char.codePointAt(0) ?? 0
    hash = Math.imul(hash, WORKSPACE_HASH_PRIME)
  }
  return hash >>> 0
}

function fallbackWorkspaceSlug(value: string): string {
  const first = hashWorkspaceText(value, 2166136261)
  const second = hashWorkspaceText(value, 2246822519)
  return 'workspace-' + first.toString(36) + '-' + second.toString(36)
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
