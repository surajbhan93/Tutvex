import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/**
 * ================================
 * 🔹 PATH FIX (ESM)
 * ================================
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * ================================
 * 🔹 IMPORT SEO CONFIGS
 * ================================
 */

// 🔸 OLD SEO (Allahabad / Lucknow / Kanpur)
import {
  ALLAHABAD_LOCATIONS,
  LUCKNOW_LOCATIONS,
  KANPUR_LOCATIONS,
  INTENTS as OLD_INTENTS,
} from "../src/components/seo/seo.config.node.js";

// 🔸 NEW SEO INDIA
import { CITIES } from "../src/components/seoIndia/locations/index.node.js";

import { INTENTS as INDIA_INTENTS } from "../src/components/seoIndia/intents.node.js";

/**
 * ================================
 * 🔹 BASE URL
 * ================================
 */
const BASE_URL = "http://localhost:3000";
// const BASE_URL = "https://yourdomain.com";

/**
 * ================================
 * 🔹 UTILS
 * ================================
 */
const slugify = (text) => text.toLowerCase().replace(/\s+/g, "-");

/**
 * ================================
 * 🔹 URL COLLECTION
 * ================================
 */
const urls = [];

/* ===============================
   🔹 1. HOMEPAGE
================================ */
urls.push(`${BASE_URL}/`);

/* ===============================
   🔹 2. OLD SEO PAGES (SAFE)
================================ */

// Allahabad
ALLAHABAD_LOCATIONS.forEach((loc) => {
  Object.values(OLD_INTENTS).forEach((group) => {
    group.forEach((intent) => {
      urls.push(
        `${BASE_URL}/allahabad/${slugify(loc)}/${slugify(intent)}`
      );
    });
  });
});

// Lucknow
LUCKNOW_LOCATIONS.forEach((loc) => {
  Object.values(OLD_INTENTS).forEach((group) => {
    group.forEach((intent) => {
      urls.push(
        `${BASE_URL}/lucknow/${slugify(loc)}/${slugify(intent)}`
      );
    });
  });
});

// Kanpur
KANPUR_LOCATIONS.forEach((loc) => {
  Object.values(OLD_INTENTS).forEach((group) => {
    group.forEach((intent) => {
      urls.push(
        `${BASE_URL}/kanpur/${slugify(loc)}/${slugify(intent)}`
      );
    });
  });
});

/* ===============================
   🔥 3. SEO INDIA (NEW)
   /india/{city}/{location}/{intent}
================================ */

CITIES.forEach((city) => {
  city.locations.forEach((location) => {
    Object.values(INDIA_INTENTS).forEach((intentGroup) => {
      intentGroup.forEach((intent) => {
        urls.push(
          `${BASE_URL}/india/${city.slug}/${slugify(location)}/${slugify(
            intent
          )}`
        );
      });
    });
  });
});

/**
 * ================================
 * 🔹 SITEMAP XML
 * ================================
 */
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `
  <url>
    <loc>${url}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join("")}
</urlset>
`;

/**
 * ================================
 * 🔹 WRITE FILE
 * ================================
 */
fs.writeFileSync(
  path.join(process.cwd(), "public", "sitemap.xml"),
  sitemap
);

console.log(`✅ Sitemap generated: ${urls.length} URLs`);
