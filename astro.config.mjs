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
  vite: {
    plugins: [{
      name: 'image-cache',
      configureServer(server) {
        server.middlewares.stack.unshift({
          route: '',
          handle(req, res, next) {
            if (/\.(webp|jpe?g|png|gif|svg|ico)(\?|$)/i.test(req.url?.split('?')[0] ?? '')) {
              res.setHeader('Cache-Control', 'public, max-age=86400')
            }
            next()
          },
        })
      },
    }],
  },
}
