import { siteConfig } from "@/lib/config";

export function GET() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${siteConfig.url}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${siteConfig.url}/" />
    <xhtml:link rel="alternate" hreflang="zu" href="${siteConfig.url}/zu" />
    <xhtml:link rel="alternate" hreflang="xh" href="${siteConfig.url}/xh" />
  </url>
  <url>
    <loc>${siteConfig.url}/zu</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${siteConfig.url}/" />
    <xhtml:link rel="alternate" hreflang="zu" href="${siteConfig.url}/zu" />
    <xhtml:link rel="alternate" hreflang="xh" href="${siteConfig.url}/xh" />
  </url>
  <url>
    <loc>${siteConfig.url}/xh</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${siteConfig.url}/" />
    <xhtml:link rel="alternate" hreflang="zu" href="${siteConfig.url}/zu" />
    <xhtml:link rel="alternate" hreflang="xh" href="${siteConfig.url}/xh" />
  </url>
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}