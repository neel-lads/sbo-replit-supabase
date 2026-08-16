import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";

const SITE_URL = "https://www.sardarbioorganic.com";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase environment variables are missing.");
}

const supabase = createClient(
  supabaseUrl,
  supabaseKey
);

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, "-and-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const { data: products, error } = await supabase
  .from("products")
  .select("name");

if (error) {
  throw error;
}

const staticUrls = [
  "/",
  "/products",
  "/dealers",
  "/contact"
];

const productUrls = (products || []).map(
  (product) => `/products/${slugify(product.name)}`
);

const urls = [
  ...staticUrls,
  ...productUrls
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
>
${urls
  .map(
    (url) => `  <url>
    <loc>${SITE_URL}${url}</loc>
  </url>`
  )
  .join("\n")}
</urlset>`;

const outputPath = path.resolve(
  "public",
  "sitemap.xml"
);

fs.writeFileSync(outputPath, xml);

console.log(
  `Generated sitemap with ${urls.length} URLs`
);