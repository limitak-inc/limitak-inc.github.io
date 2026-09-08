import { readFile, writeFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'

const fm = async (path) => {
  const raw = await readFile(path, 'utf8')
  const block = raw.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? ''
  const data = {}
  for (const line of block.split('\n')) {
    const m = line.match(/^(\w+):\s*(.+)$/)
    if (!m) continue
    data[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
  return data
}

const site = await fm('content/site.md')
const catFiles = (await readdir('content/categories')).filter((f) => f.endsWith('.md'))
const categories = await Promise.all(catFiles.map(async (f) => ({
  id: f.replace(/\.md$/, ''),
  ...(await fm(join('content/categories', f))),
})))
const products = await Promise.all(
  (await readdir('content/products'))
    .filter((f) => f.endsWith('.md'))
    .map(async (f) => ({ id: f.replace(/\.md$/, ''), ...(await fm(join('content/products', f))) }))
)
const label = (slug) => categories.find((c) => c.slug === slug)?.label ?? slug

const lines = [
  '# LimitakSteel catalog',
  '',
  `Company: ${site.company ?? 'LimitakSteel'}`,
  `Email: ${site.email ?? ''}`,
  `Instagram: ${site.instagram ?? ''}`,
  '',
  '## Categories',
  ...categories.map((c) => `- ${c.label} (${c.slug})`),
  '',
  '## Products',
  ...products.map((p) =>
    `- ${p.title} (${p.slug}): ${label(p.category)}${p.material ? `, ${p.material}` : ''}${p.model ? `, code ${p.model}` : ''}`
  ),
]

await writeFile('public/llms-full.txt', `${lines.join('\n')}\n`)
