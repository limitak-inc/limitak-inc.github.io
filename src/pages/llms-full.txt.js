import { getCatalog, categoryLabel, productHref } from '../lib/content.js'

export const GET = async ({ site }) => {
  const { siteEntry, categories, products } = await getCatalog()
  const { company, social = {} } = siteEntry.data
  const lines = [
    '# LimitakSteel catalog',
    '',
    `Company: ${company?.name ?? 'LimitakSteel'}`,
    `Email: ${company?.email ?? ''}`,
    `Instagram: ${social.instagram ?? ''}`,
    '',
    '## Categories',
    ...categories.map((category) => `- ${category.data.label} (${category.data.slug})`),
    '',
    '## Products',
    ...products.map((product) => {
      const { title, category, material, model } = product.data
      const bits = [categoryLabel(categories, category), material, model && `code ${model}`].filter(Boolean)
      return `- [${title}](${new URL(productHref(product.id), site)}): ${bits.join(', ')}`
    }),
  ]

  return new Response(`${lines.join('\n')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
