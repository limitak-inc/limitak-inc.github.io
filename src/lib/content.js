import { getCollection, getEntry } from 'astro:content'

const bg = {
  lead: ['hsl(229 85% 5%)', 'hsl(217 36% 18% / 0.6)'],
  metal: ['hsl(240 11% 4%)', 'hsl(240 4% 16% / 0.6)'],
  stone: ['hsl(20 14% 4%)', 'hsl(12 7% 15% / 0.6)'],
  lilac: ['hsl(300 14% 4%)', 'hsl(289 14% 15% / 0.6)'],
  mist: ['hsl(200 14% 4%)', 'hsl(193 12% 15% / 0.6)'],
  olive: ['hsl(60 14% 4%)', 'hsl(60 12% 15% / 0.6)'],
}

const accent = {
  orange: 'hsl(30 100% 45%)',
  copper: 'hsl(16 100% 40%)',
  gold: 'hsl(34 100% 33%)',
}

export const resolveTheme = (theme = {}) => {
  const [page, surface] = bg[theme.bg] ?? []
  const solid = accent[theme.accent]
  return {
    ...(page && { 'bg-page': page, 'bg-surface': surface }),
    ...(solid && { 'accent-solid': solid }),
  }
}

export const getSite = () => getEntry('site', 'site')

export const getCategories = () =>
  getCollection('categories').then((items) =>
    items.sort((a, b) =>
      (a.data.order ?? 999) - (b.data.order ?? 999)
      || a.data.label.localeCompare(b.data.label, 'fa')
    )
  )

export const getProducts = () =>
  getCollection('products').then((items) =>
    items.sort((a, b) =>
      (a.data.order ?? 999) - (b.data.order ?? 999)
      || a.data.title.localeCompare(b.data.title, 'fa')
    )
  )

export const categoryLabel = (categories, slug) =>
  categories.find((item) => item.data.slug === slug)?.data.label ?? slug

export const productHref = (slug) => `${import.meta.env.BASE_URL}products/${slug}/`

export const categoryHref = (slug) =>
  `${import.meta.env.BASE_URL}categories/${slug}/#products`
