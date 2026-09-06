import { getCollection, getEntry } from 'astro:content'

export const getSite = () => getEntry('site', 'site')

export const getProducts = () =>
  getCollection('products').then((items) =>
    items.sort((a, b) => a.data.title.localeCompare(b.data.title, 'fa'))
  )

export const getProduct = (slug) => getEntry('products', slug)

export const productHref = (slug) => `${import.meta.env.BASE_URL}products/${slug}/`

export const imageSrc = (path) => import.meta.env.BASE_URL + path.replace(/^\//, '')
