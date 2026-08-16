import fs from "fs";
import path from "path";

const BASE_URL = "https://www.sardarbioorganic.com";

const products = [
  "58-commando",
  "arunoday",
  "combi-pack",
  "guru",
  "ketu",
  "live",
  "maahir",
  "neemguru-10000-ppm",
  "neemguru-1500-ppm",
  "palak",
  "pasand",
  "pasand-liquid",
  "prakruti-azoto",
  "prakruti-bio-npk-liquid",
  "prakruti-bio-npk",
  "prakruti-mycorrhiza-1200-ip",
  "prakruti-mycorrhiza-300000-ip",
  "prakruti-phospho",
  "prakruti-potash",
  "prakruti-prom",
  "prakruti-zinc",
  "prakruti-zinc-liquid",
  "trichoguru",
  "trichoguru-liquid",
  "vian",
  "vm",
  "winner",
  "winner-liquid"
];

const pages = [
  "",
  "/products",
  "/dealers",
  "/contact"
];

const urls = [
  ...pages.map((page) => ({
    loc: `${BASE_URL}${page}`,
    priority: page === "" ? "1.0" : "0.8"
  })),

  ...products.map((product) => ({
    loc: `${BASE_URL}/products/${product}`,
    priority: "0.7"
  }))
];

const today = new Date().toISOString().split("T")[0];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
>
${urls
  .map(
    ({ loc, priority }) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

const publicDir = path.resolve("public");

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const sitemapPath = path.join(publicDir, "sitemap.xml");

fs.writeFileSync(sitemapPath, sitemap, "utf8");

console.log(`Sitemap generated successfully: ${sitemapPath}`);
console.log(`Total URLs: ${urls.length}`);