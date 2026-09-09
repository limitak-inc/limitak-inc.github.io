import { getCollection, getEntry } from "astro:content";

const bg = {
  lead: ["hsl(230 85% 5%)", "hsl(217 36% 18% / 0.6)"],
  mist: ["hsl(200 14% 4%)", "hsl(193 12% 15% / 0.6)"],
  lilac: ["hsl(300 14% 4%)", "hsl(290 14% 15% / 0.6)"],
  olive: ["hsl(60 14% 4%)", "hsl(60 12% 15% / 0.6)"],
  stone: ["hsl(16 38% 6%)", "hsl(14 26% 16% / 0.6)"],
};

const accent = {
  orange: "hsl(30 100% 45%)",
  copper: "hsl(20 100% 40%)",
  crimson: "hsl(350 80% 50%)",
  teal: "hsl(180 100% 40%)",
  lime: "hsl(80 100% 40%)",
  indigo: "hsl(245 100% 65%)",
};

export const resolveTheme = (theme = {}) => {
  const [page, surface] = bg[theme.bg] ?? [];
  const solid = accent[theme.accent];
  return {
    ...(page && { "bg-page": page, "bg-surface": surface }),
    ...(solid && { "accent-solid": solid }),
  };
};

const byOrder = (key) => (a, b) =>
  (a.data.order ?? 999) - (b.data.order ?? 999) ||
  a.data[key].localeCompare(b.data[key], "fa");

export const getSite = () => getEntry("site", "site");

export const getCategories = () =>
  getCollection("categories").then((items) => items.toSorted(byOrder("label")));

export const getProducts = () =>
  getCollection("products").then((items) => items.toSorted(byOrder("title")));

export const getCatalog = async () => {
  const [siteEntry, categories, products] = await Promise.all([
    getSite(),
    getCategories(),
    getProducts(),
  ]);
  const used = new Set(products.map((product) => product.data.category));
  return {
    siteEntry,
    products,
    categories: categories.filter((category) => used.has(category.data.slug)),
  };
};

export const categoryLabel = (categories, slug) =>
  categories.find((item) => item.data.slug === slug)?.data.label ?? slug;

export const productHref = (slug) =>
  `${import.meta.env.BASE_URL}products/${slug}/`;

export const categoryHref = (slug) =>
  `${import.meta.env.BASE_URL}categories/${slug}/#products`;
