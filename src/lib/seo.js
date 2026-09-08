import { imageSrc } from './content.js'

const trim = (text, max = 160) =>
  text?.replace(/\s+/g, ' ').trim().slice(0, max) ?? ''

export const seoTitle = (title, siteName) =>
  title ? `${title} | ${siteName}` : siteName

export const absUrl = (site, path = '/') => {
  const base = typeof site === 'string' ? site : site?.href
  if (!base) return path
  return new URL(path.replace(/^\//, ''), base.endsWith('/') ? base : `${base}/`).href
}

export const productDescription = (product, categoryLabel) => {
  const body = trim(product.body, 160)
  if (body) return body
  const parts = [
    product.data.title,
    categoryLabel,
    product.data.material,
    product.data.model && `کد ${product.data.model}`,
  ].filter(Boolean)
  return parts.join(' | ')
}

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
  type = 'website',
}) => {
  const siteName = company.name ?? 'لیمیتک'
  const pageTitle = seo.title || title
  const metaTitle = seoTitle(pageTitle, siteName)
  const metaDescription = trim(seo.description || description || siteSeo.description)
  const shareImage = seo.image || image || siteSeo.image || company.logoFull
  const ogImage = site && shareImage
    ? absUrl(site, imageSrc(shareImage))
    : undefined
  const canonical = site ? absUrl(site, canonicalPath ?? '/') : undefined
  const noindex = seo.noindex ?? false

  return { siteName, metaTitle, metaDescription, ogImage, canonical, type, noindex }
}
