export const plainText = (text, max = 160) =>
  `${text ?? ''}`
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`~>#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)

const seoTitle = (title, siteName) =>
  [title, siteName].filter(Boolean).join(' | ')

export const absUrl = (site, path = '/') => {
  const base = typeof site === 'string' ? site : site?.href
  if (!base) return path
  return new URL(path.replace(/^\//, ''), base.endsWith('/') ? base : `${base}/`).href
}

export const productDescription = (product, categoryLabel) =>
  plainText(product.body, 160) || [
    product.data.title,
    categoryLabel,
    product.data.material,
    product.data.model && `کد ${product.data.model}`,
  ].filter(Boolean).join(' | ')

/** @param {{ title?: string, description?: string, image?: string, noindex?: boolean }} seo */
export const resolveMeta = ({
  title,
  description = '',
  image,
  seo = {},
  siteSeo = {},
  company = {},
  site,
  canonicalPath,
}) => {
  const siteName = company.name ?? 'لیمیتک'
  const metaTitle = seoTitle(seo.title || title, siteName)
  const metaDescription = plainText(seo.description || description || siteSeo.description)
  const ogImage = site && image ? absUrl(site, image) : undefined
  const canonical = site ? absUrl(site, canonicalPath ?? '/') : undefined
  return {
    metaTitle,
    metaDescription,
    ogImage,
    canonical,
    noindex: seo.noindex ?? false,
  }
}
