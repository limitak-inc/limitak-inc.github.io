import { existsSync } from 'node:fs'
import { join } from 'node:path'

export const dims = {
  hero: { w: 1280, h: 547 },
  product: { w: 1200, h: 1200 },
  card: { w: 400, h: 400 },
}

export const raster = (path) => /\.(jpe?g|png)$/i.test(path)

export const webpPath = (path) => path.replace(/\.(jpe?g|png)$/i, '.webp')

export const publicRel = (src) =>
  src.replace(import.meta.env.BASE_URL, '').replace(/^\//, '')

export const webpReady = (src) =>
  raster(src) && existsSync(join(process.cwd(), 'public', webpPath(publicRel(src))))
