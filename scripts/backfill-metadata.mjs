import { readFileSync, writeFileSync, readdirSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'

const dir = '/home/metaory/dev/limitak-neo/content/products'

const categoryRules = [
  ['جاقاشقی', 'جاقاشقی'],
  ['جاظرفی', 'جاظرفی'],
  ['جا دستمال', 'جا دستمال'],
  ['جااسکاچی', 'جا اسکاچی'],
  ['جا اسکاچی', 'جا اسکاچی'],
  ['استند', 'استند'],
  ['ست سینک', 'ست سینک'],
  ['زیر دیگی', 'زیر دیگی'],
  ['جالیوانی', 'جالیوانی'],
  ['کنار گازی', 'کنار گازی'],
  ['راف', 'راف چوبی'],
]

const categorySlug = {
  'جاقاشقی': 'jaqashqi',
  'جاظرفی': 'jazarfi',
  'جا دستمال': 'jadastmal',
  'جا اسکاچی': 'jaaskachi',
  'استند': 'stand',
  'ست سینک': 'sinsink',
  'زیر دیگی': 'zirdighi',
  'جالیوانی': 'jalivani',
  'کنار گازی': 'konargazi',
  'راف چوبی': 'rafchoobi',
}

const tagRules = ['تک قلو', 'دو قلو', 'دوقلو', 'چاپدار', 'رومیزی', 'دیوارکوب', 'آویز', 'ساده', 'صبا']

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
    if (k === 'tags') {
      fm.tags = v === '' ? [] : v.startsWith('[') ? JSON.parse(v) : [v.replace(/^["']|["']$/g, '')]
      continue
    }
    if (v) fm[k] = v.replace(/^["']|["']$/g, '')
  }
  return { fm, body }
}

const inferCategory = (title) =>
  categoryRules.find(([p]) => title.includes(p))?.[1]

const inferMaterial = (title) =>
  title.includes('استیل') ? 'استیل'
  : /چوب|چوبی/.test(title) ? 'چوب'
  : 'فلز'

const inferTags = (title) => tagRules.filter((t) => title.includes(t))

const yaml = (obj) =>
  Object.entries(obj)
    .filter(([, v]) => v !== undefined && v !== '' && v !== null && !(Array.isArray(v) && !v.length))
    .map(([k, v]) => Array.isArray(v)
      ? `${k}:\n${v.map((t) => `  - ${JSON.stringify(t)}`).join('\n')}`
      : typeof v === 'number' ? `${k}: ${v}` : `${k}: ${JSON.stringify(String(v))}`)
    .join('\n')

const products = readdirSync(dir).filter((f) => f.endsWith('.md')).map((file) => {
  const { fm, body } = parse(readFileSync(join(dir, file), 'utf8'))
  const title = fm.title || ''
  const category = inferCategory(title)
  return {
    file,
    body,
    data: {
      title,
      image: fm.image,
      model: fm.model,
      size: fm.size,
      pcs: fm.pcs ? Number(fm.pcs) : undefined,
      order: fm.order ? Number(fm.order) : undefined,
      category,
      material: inferMaterial(title),
      tags: inferTags(title),
    },
  }
})

const byCategory = Object.groupBy(products, (p) => p.data.category || 'other')
const written = []

for (const [cat, items] of Object.entries(byCategory)) {
  const prefix = categorySlug[cat] || 'product'
  items
    .sort((a, b) => (a.data.order ?? 999) - (b.data.order ?? 999))
    .forEach((item, i) => {
      const slug = `${prefix}-${i + 1}`
      written.push({ ...item, slug })
    })
}

for (const file of readdirSync(dir).filter((f) => f.endsWith('.md')))
  unlinkSync(join(dir, file))

for (const { slug, data, body } of written) {
  const front = yaml({ slug, ...data })
  writeFileSync(join(dir, `${slug}.md`), `---\n${front}\n---\n${body ? `\n${body}\n` : '\n'}`)
}

written.sort((a, b) => (a.data.order ?? 999) - (b.data.order ?? 999))
console.log(`backfilled ${written.length} products`)
written.forEach((p) => console.log(`  ${p.data.order ?? '?'}\t${p.slug}\t${p.data.category}\t${p.data.title}`))
