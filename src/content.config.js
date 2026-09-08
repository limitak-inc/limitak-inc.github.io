import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'

const materials = ['فلز', 'استیل', 'چوب', 'چوب و فلز', 'چوب و استیل']

const seo = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  noindex: z.boolean().optional(),
}).optional()

const categories = defineCollection({
  loader: glob({ base: './content/categories', pattern: '**/*.md' }),
  schema: z.object({
    slug: z.string(),
    label: z.string(),
    order: z.number().optional(),
    seo,
  }),
})

const products = defineCollection({
  loader: glob({ base: './content/products', pattern: '**/*.md' }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    image: z.string(),
    category: z.string(),
    material: z.enum(materials).optional(),
    tags: z.array(z.string()).optional(),
    model: z.string().optional(),
    size: z.string().optional(),
    pcs: z.number().optional(),
    order: z.number().optional(),
    seo,
  }),
})

const site = defineCollection({
  loader: glob({ base: './content', pattern: 'site.md' }),
  schema: z.object({
    company: z.object({
      name: z.string(),
      logo: z.string().optional(),
      logoFooter: z.string().optional(),
      logoFull: z.string().optional(),
      favicon: z.string().optional(),
      email: z.string().optional(),
      phones: z.array(z.string()).optional(),
    }),
    hero: z.object({
      title: z.string(),
      image: z.string(),
    }),
    theme: z.object({
      bg: z.enum(['lead', 'metal', 'stone', 'lilac', 'mist', 'olive']).optional(),
      accent: z.enum(['orange', 'copper', 'gold']).optional(),
    }).optional(),
    social: z.object({
      instagram: z.string().optional(),
      telegram: z.string().optional(),
      whatsapp: z.string().optional(),
      handle: z.string().optional(),
    }).optional(),
    seo,
    faq: z.array(z.object({
      q: z.string(),
      a: z.string(),
    })).optional(),
  }),
})

export const collections = { categories, products, site }
