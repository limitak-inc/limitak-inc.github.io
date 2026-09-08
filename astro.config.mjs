import sitemap from '@astrojs/sitemap'

/** @type {import('astro').AstroUserConfig} */
export default {
  output: 'static',
  site: 'https://limitak-inc.github.io',
  base: '/',
  integrations: [sitemap()],
  build: {
    format: 'directory',
  },
}
