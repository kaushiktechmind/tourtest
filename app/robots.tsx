import type { MetadataRoute } from 'next';
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/', // Ensure this doesn't block important pages
    },
    sitemap: 'https://andman-newww.vercel.app/sitemap.xml',
  };
}
