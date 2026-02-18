import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://promptvault.vercel.app'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/dashboard/',
          '/user/',
          '/api/',
          '/auth/',
          '/_next/',
          '/static/',
          '/*.json$',
          '/sitemap.xml'
        ]
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/dashboard/',
          '/user/',
          '/api/',
          '/auth/',
          '/_next/',
          '/static/'
        ],
        crawlDelay: 1
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: [
          '/admin/',
          '/dashboard/',
          '/user/',
          '/api/',
          '/auth/'
        ]
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: [
          '/admin/',
          '/dashboard/',
          '/user/',
          '/api/',
          '/auth/'
        ]
      },
      {
        userAgent: 'CCBot',
        allow: '/',
        disallow: [
          '/admin/',
          '/dashboard/',
          '/user/',
          '/api/',
          '/auth/'
        ]
      },
      {
        userAgent: 'anthropic-ai',
        allow: '/',
        disallow: [
          '/admin/',
          '/dashboard/',
          '/user/',
          '/api/',
          '/auth/'
        ]
      },
      {
        userAgent: 'Claude-Web',
        allow: '/',
        disallow: [
          '/admin/',
          '/dashboard/',
          '/user/',
          '/api/',
          '/auth/'
        ]
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  }
}
