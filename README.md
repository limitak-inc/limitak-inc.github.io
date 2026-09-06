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
3. Push to `main` triggers the deploy workflow
4. GitHub Actions builds the Astro site and publishes to GitHub Pages

## Repository setup

### 1. Create GitHub organization (optional)

Create an organization at [github.com/organizations/plan](https://github.com/organizations/plan) if you want a shared org account.

### 2. Create repository

1. Create a new repository (e.g. `limitak-neo`)
2. Push this project to the `main` branch

```bash
git branch -M main
git remote add origin git@github.com:YOUR_ORG/limitak-neo.git
git push -u origin main
```

### 3. Enable GitHub Pages

1. Open **Settings → Pages**
2. Under **Build and deployment**, set **Source** to **GitHub Actions**
3. After the first successful deploy, the site URL appears on the same page

**Project site URL**: `https://YOUR_ORG.github.io/limitak-neo/`

If you use a user/org root site (`YOUR_ORG.github.io`), set `base: '/'` in `astro.config.mjs`.

### 4. Connect Pages CMS

1. Go to [app.pagescms.org](https://app.pagescms.org)
2. Sign in with **GitHub**
3. Install the **Pages CMS** GitHub App on your repository
4. Select branch **`main`**
5. Pages CMS reads [`.pages.yml`](.pages.yml) automatically

Authentication is GitHub-only via the Pages CMS GitHub App. No custom OAuth setup is required.

## How to update content (non-technical editor)

### Add or edit a product

1. Open [app.pagescms.org](https://app.pagescms.org) and select the repository
2. Go to **Products**
3. Click **Add** or open an existing product
4. Fill in: name, image, model, size, description
5. Click **Save** (Pages CMS commits to Git automatically)

### Upload images

Use the image picker in any product or site field. Files are saved to `public/images/` and referenced as `/images/filename.ext`.

### Edit company information

1. Open **Site Settings** in Pages CMS
2. Update company name, phone, email, address
3. Update hero title, hero image, hero description
4. Update footer links and copyright
5. Save

Changes appear on the live site after GitHub Actions finishes deploying (usually 1–2 minutes).

## Local development

```bash
pnpm install
pnpm run dev
```

Open [http://localhost:4321/limitak-neo/](http://localhost:4321/limitak-neo/) (base path matches production).

```bash
pnpm run build    # output in dist/
pnpm run preview  # preview production build
```

## Project structure

```
content/
  site.md              # company, hero, footer settings
  products/*.md        # one file per product
public/images/         # CMS image uploads
src/                   # Astro pages and components
.pages.yml             # Pages CMS configuration
.github/workflows/     # deploy on push to main
```

## Configuration

| File | Purpose |
|------|---------|
| [`astro.config.mjs`](astro.config.mjs) | Site URL, base path, static output |
| [`.pages.yml`](.pages.yml) | CMS fields, media paths, commit messages |
| [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) | Build and deploy pipeline |

### Base path

For a project site (`username.github.io/repo-name/`), keep:

```js
base: '/limitak-neo/'
```

For a root site (`username.github.io`), change to:

```js
base: '/'
```

## Troubleshooting

**Site loads but CSS/images are broken**

Check that `base` in `astro.config.mjs` matches your GitHub Pages URL path.

**Pages CMS cannot save**

Confirm the Pages CMS GitHub App is installed on the repository with write access to `main`.

**Images not showing**

CMS stores paths like `/images/photo.webp`. Files must live in `public/images/`.

**Deploy did not run**

Ensure Pages source is **GitHub Actions** (not "Deploy from branch") and the push was to `main`.

## License

MIT
