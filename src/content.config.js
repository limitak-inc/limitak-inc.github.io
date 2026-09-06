import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'

const products = defineCollection({
  loader: glob({ base: './content/products', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    image: z.string(),
    model: z.string(),
    size: z.string(),
  }),
})

const site = defineCollection({
  loader: glob({ base: './content', pattern: 'site.md' }),
  schema: z.object({
    company: z.object({
      name: z.string(),
      phone: z.string(),
      email: z.string(),
      address: z.string(),
    }),
    hero: z.object({
      title: z.string(),
      image: z.string(),
    }),
    footer: z.object({
      copyright: z.string(),
      links: z.array(z.object({
        label: z.string(),
        url: z.string(),
      })).optional(),
    }),
  }),
})

export const collections = { products, site }
