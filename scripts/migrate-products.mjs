import { readFileSync, writeFileSync, readdirSync, unlinkSync } from 'node:fs'
import { join, basename } from 'node:path'

const src = '/home/metaory/dev/limitak/content/products'
const dst = '/home/metaory/dev/limitak-neo/content/products'

const parse = (raw) => {
  const parts = raw.split(/^---\n/m)
  const block = parts[1] ?? ''
  const body = parts[2]?.trim() ?? ''
  const fm = {}
  const lines = block.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const kv = lines[i].match(/^(\w+):\s*(.*)$/)
    if (!kv) continue
    const [, k, v] = kv
    if (k === 'description') {
      const desc = [v]
      while (i + 1 < lines.length && lines[i + 1].startsWith('  '))
        desc.push(lines[++i].slice(2))
      fm.description = desc.join(' ').replace(/^["']|["']$/g, '')
      continue
    }
    if (v) {
      fm[k] = v.replace(/^["']|["']$/g, '')
      continue
    }
    if (k === 'description' && lines[i + 1]?.startsWith('  ')) {
      const desc = []
      while (++i < lines.length && lines[i].startsWith('  '))
        desc.push(lines[i].slice(2))
      fm.description = desc.join(' ')
    }
  }
  return { fm, body }
}

const imagePath = (old) => {
  const file = basename(old).toLowerCase()
  const stem = file.replace(/\.(png|jpe?g)$/, '')
  const name = file.endsWith('.png') ? `${stem}.jpg` : file
  return { path: `/images/${name}`, slug: stem.replace(/_/g, '-') }
}

const cleanTitle = (name) =>
  name
    .replace(/^Pro/, '')
    .replace(/\s*مدل\s*$/u, '')
    .replace(/\s+/g, ' ')
    .trim()

const isDummy = (name) => /^Product \d+$/.test(name)
const isDummyDesc = (d) => !d || /^Dummy product description/.test(d)

const yaml = (obj) =>
  Object.entries(obj)
    .filter(([, v]) => v !== undefined && v !== '' && v !== null)
    .map(([k, v]) => typeof v === 'number' ? `${k}: ${v}` : `${k}: ${JSON.stringify(String(v))}`)
    .join('\n')

for (const file of readdirSync(dst).filter((f) => f.endsWith('.md')))
  unlinkSync(join(dst, file))

const migrated = []

for (const file of readdirSync(src).filter((f) => f.endsWith('.md'))) {
  const { fm } = parse(readFileSync(join(src, file), 'utf8'))
  const rawName = (fm.name || '').trim()
  if (!rawName || isDummy(rawName)) continue

  const title = cleanTitle(rawName)

  const { path: image, slug } = imagePath(fm.image || '')
  const body = !isDummyDesc(fm.description) ? fm.description : ''
  const pcs = fm.pcs ? Number(fm.pcs) : undefined
  const order = fm.order ? Number(fm.order) : undefined
  const model = fm.model && !/^Model \d+$/i.test(fm.model) ? fm.model : undefined
  const size = fm.size || undefined

  const front = yaml({ slug, title, image, model, pcs, size, order })
  const content = `---\n${front}\n---\n${body ? `\n${body}\n` : '\n'}`
  writeFileSync(join(dst, `${slug}.md`), content)
  migrated.push({ slug, title, order })
}

migrated.sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
console.log(`migrated ${migrated.length} products`)
migrated.forEach((p) => console.log(`  ${p.order ?? '?'}\t${p.slug}\t${p.title}`))
