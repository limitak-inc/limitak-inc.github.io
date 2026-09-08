import { absUrl } from '../lib/seo.js'

/** @param {{ site: URL, company: object, social?: object }} props */
export const organizationSchema = ({ site, company, social = {} }) => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: company.name,
  url: site.href,
  logo: company.logoFull ? absUrl(site, company.logoFull) : undefined,
  email: company.email,
  telephone: company.phones?.[0],
  contactPoint: company.phones?.map((phone) => ({
    '@type': 'ContactPoint',
    telephone: phone,
    contactType: 'sales',
    areaServed: 'IR',
    availableLanguage: 'Persian',
  })),
  sameAs: [social.instagram, social.telegram, social.whatsapp].filter(Boolean),
})

export const websiteSchema = ({ site, company }) => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: company.name,
  url: site.href,
  inLanguage: 'fa-IR',
})

/** @param {{ site: URL, product: object, categoryLabel: string, description: string, companyName: string }} props */
export const productSchema = ({ site, product, categoryLabel, description, companyName }) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.data.title,
  description,
  image: absUrl(site, product.data.image),
  sku: product.data.model,
  brand: { '@type': 'Brand', name: companyName },
  category: categoryLabel,
})

/** @param {{ site: URL, items: { name: string, url: string }[] }} props */
export const breadcrumbSchema = ({ site, items }) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: absUrl(site, item.url),
  })),
})

/** @param {{ faqs: { q: string, a: string }[] }} props */
export const faqSchema = ({ faqs }) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
})
