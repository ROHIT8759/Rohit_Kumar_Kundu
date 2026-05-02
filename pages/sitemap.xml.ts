import type { NextApiRequest, NextApiResponse } from "next";
import { getSiteUrl } from "../src/lib/siteUrl";

const buildUrlEntry = (loc: string, lastmod: string) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>`;

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const siteUrl = getSiteUrl();
  const lastmod = new Date().toISOString();

  const urls = [buildUrlEntry(`${siteUrl}/`, lastmod)];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.status(200).send(xml);
}