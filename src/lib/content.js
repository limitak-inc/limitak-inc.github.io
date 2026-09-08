import { getCollection, getEntry } from 'astro:content'

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
  categories.find((item) => item.id === slug)?.data.label ?? slug

export const productHref = (slug) => `${import.meta.env.BASE_URL}products/${slug}/`

export const categoryHref = (slug) =>
  `${import.meta.env.BASE_URL}?category=${slug}#products`

export const imageSrc = (path) => import.meta.env.BASE_URL + path.replace(/^\//, '')
