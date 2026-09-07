import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'

const products = defineCollection({
  loader: glob({ base: './content/products', pattern: '**/*.md' }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    image: z.string(),
    category: z.string().optional(),
    material: z.string().optional(),
    tags: z.array(z.string()).optional(),
    model: z.string().optional(),
    size: z.string().optional(),
    pcs: z.number().optional(),
    order: z.number().optional(),
  }),
})

const site = defineCollection({
  loader: glob({ base: './content', pattern: 'site.md' }),
  schema: z.object({
    company: z.object({
      name: z.string(),
      logo: z.string().optional(),
      email: z.string().optional(),
      phones: z.array(z.string()),
    }),
    hero: z.object({
      title: z.string(),
      image: z.string(),
    }),
    social: z.object({
      instagram: z.string().optional(),
      telegram: z.string().optional(),
      handle: z.string().optional(),
    }).optional(),
  }),
})

export const collections = { products, site }
