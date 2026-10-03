#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()
const roots = ['src', 'supabase/migrations', 'proxy.ts', 'next.config.ts', 'middleware.ts']
const extensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.sql'])

const forbidden = [
  { name: 'Supabase service-role credential', pattern: /service_role|SUPABASE_SERVICE_ROLE/i },
  { name: 'dangerouslySetInnerHTML', pattern: /dangerouslySetInnerHTML/ },
  { name: 'innerHTML sink', pattern: /(?:^|[.\s])innerHTML\s*=/ },
  { name: 'eval sink', pattern: /\beval\s*\(/ },
  { name: 'Function constructor sink', pattern: /\bnew\s+Function\s*\(/ },
]

function collect(target) {
  const full = path.join(root, target)
  if (!fs.existsSync(full)) return []
  const stat = fs.statSync(full)
  if (stat.isFile()) return extensions.has(path.extname(full)) ? [full] : []
  const out = []
  for (const entry of fs.readdirSync(full, { withFileTypes: true })) {
    const child = path.join(full, entry.name)
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.next') out.push(...collect(path.relative(root, child)))
    else if (entry.isFile() && extensions.has(path.extname(entry.name))) out.push(child)
  }
  return out
}

const files = roots.flatMap(collect)
const findings = []

for (const file of files) {
  const text = fs.readFileSync(file, 'utf8')
  const lines = text.split(/\r?\n/)
  lines.forEach((line, index) => {
    for (const rule of forbidden) {
      if (rule.pattern.test(line)) {
        findings.push({
          file: path.relative(root, file),
          line: index + 1,
          rule: rule.name,
          text: line.trim(),
        })
      }
    }
  })
}

if (findings.length) {
  process.stderr.write('Security static scan failed:\n')
  for (const finding of findings) {
    process.stderr.write(`${finding.file}:${finding.line} [${finding.rule}] ${finding.text}\n`)
  }
  process.exit(1)
}

process.stdout.write(`Security static scan passed: ${files.length} source files checked.\n`)
