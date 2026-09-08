import { getImage } from 'astro:assets'

const files = import.meta.glob('/src/assets/{images,logos}/*', {
  eager: true,
  import: 'default',
})
const assets = Object.fromEntries(
  Object.entries(files).map(([path, image]) => [
    path.replace('/src/assets/images', '/images').replace('/src/assets/logos', '/assets'),
    image,
  ]),
)

/** Pages CMS path -> imported Astro asset */
export const asset = (src) => assets[src]

/** Pages CMS path -> emitted source URL */
export const assetSrc = (src) => asset(src)?.src ?? src

/** Pages CMS path -> optimized social image URL */
export const share = async (src) => {
  const image = asset(src)
  if (!image) return src
  return (await getImage({ src: image, width: 1200, format: 'jpeg' })).src
}
