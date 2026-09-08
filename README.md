# limitak-neo

Static product catalog with Git-backed CMS. No database, no server, zero cost.

- **Public site**: Astro static site (Persian, RTL)
- **CMS**: [Pages CMS](https://app.pagescms.org) (free, GitHub App)
- **Content**: Markdown + YAML frontmatter in Git
- **Deploy**: GitHub Actions → GitHub Pages

## Content flow

```
Pages CMS → Git commit → GitHub Actions → GitHub Pages → live website
```

1. Editor opens Pages CMS and changes products or site settings
2. Pages CMS commits to the repository
3. Push to `master` triggers the deploy workflow
4. GitHub Actions builds the Astro site and publishes to GitHub Pages

## Repository setup

### 1. Create repository

Create an **organization Pages repo** named exactly **`limitak-inc.github.io`** under org **limitak-inc**. Do not add README, license, or `.gitignore` (this project already has them).

Push to `master`:

```bash
git remote set-url origin git@github-alt:limitak-inc/limitak-inc.github.io.git
git push -u origin master
```

If your SSH config uses a different host alias, replace `github-alt` with that name (not `github.com`).

### 2. Enable GitHub Pages

1. Open **Settings → Pages**
2. Under **Build and deployment**, set **Source** to **GitHub Actions**
3. After the first successful deploy, the site URL appears on the same page

**Site URL**: `https://limitak-inc.github.io/`

### 3. Connect Pages CMS

1. Go to [app.pagescms.org](https://app.pagescms.org)
2. Sign in with **GitHub**
3. Install the **Pages CMS** GitHub App on your repository
4. Select branch **`master`**
5. Pages CMS reads [`.pages.yml`](.pages.yml) automatically

Authentication is GitHub-only via the Pages CMS GitHub App.

## How to update content

### Add or edit a product

1. Open [app.pagescms.org](https://app.pagescms.org) and select the repository
2. Go to **محصولات**
3. Click **Add** or open an existing product
4. Fill in: slug, title, image, category, material, model, pcs, size, tags, description
5. Click **Save** (Pages CMS commits to Git automatically)

### Upload images

Use the image picker in any product or site field. Supported formats: **JPEG, PNG, WebP, AVIF**.

Product media is saved to `src/assets/images/`; logos are saved to `src/assets/logos/`.
Pages CMS writes their logical `/images/...` and `/assets/...` paths into content.

Astro owns optimization. Every image goes through `astro:assets` at build time, which emits hashed WebP variants under `/_astro/` at the sizes each layout actually needs. Upload originals at full resolution and leave the rest alone.

### Edit site settings

1. Open **تنظیمات سایت** in Pages CMS
2. Company: name, logo, email, phones
3. Hero: title, image, description (body)
4. Social: handle, Instagram URL, Telegram URL
5. Save

Changes appear on the live site after GitHub Actions finishes deploying (usually 1–2 minutes).

## Local development

```bash
pnpm install
pnpm run dev
```

Open [http://localhost:4321/](http://localhost:4321/).

```bash
pnpm run build    # output in dist/
pnpm run preview  # preview production build
```

## Project structure

```
content/
  site.md              # company, hero, social
  categories/*.md      # category labels and order
  products/*.md        # one file per product
src/assets/images/     # CMS image uploads, optimized by Astro
src/assets/logos/      # CMS logo uploads, optimized by Astro
src/                   # Astro pages and components
.pages.yml             # Pages CMS configuration
.github/workflows/     # deploy on push to master
```

## Configuration

| File | Purpose |
|------|---------|
| [`astro.config.mjs`](astro.config.mjs) | Site URL, base path, static output |
| [`.pages.yml`](.pages.yml) | CMS fields, media paths, commit messages |
| [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) | Build and deploy pipeline |

### Site URL

This project uses an org root site:

```js
site: 'https://limitak-inc.github.io',
base: '/',
```

When you add a custom domain, change only `site`:

```js
site: 'https://yourdomain.com',
base: '/',
```

Then update `Sitemap:` in [`public/robots.txt`](public/robots.txt) to match.

## SEO and marketing

### After deploy

1. Open [Google Search Console](https://search.google.com/search-console) and add the site property
2. Submit `https://limitak-inc.github.io/sitemap-index.xml`
3. Open [Bing Webmaster Tools](https://www.bing.com/webmasters) and submit the same sitemap
4. Check indexing after a few days (home, products)

### Analytics (optional)

Copy [`.env.example`](.env.example) to `.env` and set:

- `PUBLIC_ANALYTICS` - script URL (Plausible, Cloudflare Web Analytics, etc.)
- `PUBLIC_ANALYTICS_DOMAIN` - site hostname

### Custom domain migration

1. Set `site` in [`astro.config.mjs`](astro.config.mjs)
2. Configure DNS / CNAME for GitHub Pages
3. Enable HTTPS in repo Settings → Pages
4. Update sitemap URL in [`public/robots.txt`](public/robots.txt)
5. Add the new domain in Search Console and resubmit sitemap
6. Update social links if they still point to the old URL

### CMS SEO fields

Pages CMS exposes per-page SEO under **SEO** on site settings and products. Leave fields empty to use auto-generated titles and descriptions.

### AI discovery

- `llms.txt` - site summary built from site content (`src/pages/llms.txt.js`)
- `llms-full.txt` - full catalog built from content collections (`src/pages/llms-full.txt.js`)

## Troubleshooting

**Site loads but CSS/images are broken**

Check that `base` in `astro.config.mjs` matches your GitHub Pages URL path.

**Pages CMS cannot save**

Confirm the Pages CMS GitHub App is installed on the repository with write access to `master`.

**Images not showing**

CMS stores logical paths like `/images/photo.jpg` and `/assets/logo.png`.
`src/lib/image.js` maps them to their matching files under `src/assets/`.

**Deploy did not run**

Ensure Pages source is **GitHub Actions** (not "Deploy from branch") and the push was to `master`.

## License

MIT
