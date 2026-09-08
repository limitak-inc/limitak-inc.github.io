import { getCategories, getProducts, getSite, productHref } from '../lib/content.js'

export const prerender = true

export const GET = async ({ site }) => {
  const [entry, categories, products] = await Promise.all([
    getSite(),
    getCategories(),
    getProducts(),
  ])
  const used = new Set(products.map((product) => product.data.category))
  const label = (slug) =>
    categories.find((cat) => cat.data.slug === slug)?.data.label ?? slug
  const company = entry?.data.company?.name ?? 'LimitakSteel'
  const email = entry?.data.company?.email ?? ''
  const instagram = entry?.data.social?.instagram ?? ''
  const lines = [
    '# LimitakSteel catalog',
    '',
    `Company: ${company}`,
    `Email: ${email}`,
    `Instagram: ${instagram}`,
    '',
    '## Categories',
    ...categories
      .filter((category) => used.has(category.data.slug))
      .map((category) => `- ${category.data.label} (${category.data.slug})`),
    '',
    '## Products',
    ...products.map((product) => {
      const { title, category, material, model } = product.data
      const bits = [label(category), material, model && `code ${model}`].filter(Boolean)
      return `- [${title}](${new URL(productHref(product.id), site)}): ${bits.join(', ')}`
    }),
  ]
  return new Response(`${lines.join('\n')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
