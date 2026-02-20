# 🚀 PromptVault - AI Prompts Collection

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/myasirghaffar1-gmailcoms-projects/v0-ai-prompt-app)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/lhRUdRRdFgG)
[![SEO Optimized](https://img.shields.io/badge/SEO%20Optimized-100%25-green?style=for-the-badge)](https://github.com/myasirghaffar/PromptVault)
[![Core Web Vitals](https://img.shields.io/badge/Core%20Web%20Vitals-All%20Green-brightgreen?style=for-the-badge)](https://github.com/myasirghaffar/PromptVault)

## 🎯 Overview

**PromptVault** is a world-class, SEO-optimized platform for discovering and sharing high-quality AI prompts. Built with Next.js 15 and optimized for maximum search visibility, Core Web Vitals, and AI search readiness.

### ✨ Key Features

- 🔍 **Curated AI Prompts** - High-quality prompts for Gemini, Midjourney, Claude, and more
- 🎯 **SEO Optimized** - 100% Lighthouse SEO score with structured data
- ⚡ **Core Web Vitals Ready** - Optimized for performance and user experience
- 🤖 **AI Search Friendly** - Optimized for AI assistants, Google AI Overviews, and other AI crawlers
- 📱 **PWA Ready** - Progressive Web App with offline capabilities
- 🎨 **Beautiful UI** - Modern, responsive design with dark theme
- 🔐 **User Authentication** - Secure login with Supabase
- 📝 **Content Management** - Submit, approve, and manage prompts
- 📊 **Admin Dashboard** - Comprehensive admin controls

## 🚀 Live Demo

**[https://vercel.com/myasirghaffar1-gmailcoms-projects/v0-ai-prompt-app](https://vercel.com/myasirghaffar1-gmailcoms-projects/v0-ai-prompt-app)**

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component library
- **Lucide React** - Beautiful icons

### Backend & Database

- **Supabase** - Authentication and database
- **PostgreSQL** - Primary database
- **Server Components** - Optimized rendering

### SEO & Performance

- **Next.js Metadata API** - Dynamic SEO metadata
- **Structured Data** - JSON-LD schemas for rich snippets
- **Next.js Image** - Optimized image delivery
- **PWA Manifest** - Progressive Web App features

### Deployment

- **Vercel** - Hosting and deployment
- **Vercel Analytics** - Performance monitoring
- **Vercel Speed Insights** - Core Web Vitals tracking

## 📁 Project Structure

```
PromptVault/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── admin/             # Admin dashboard
│   ├── blog/              # Blog pages
│   ├── faq/               # FAQ page
│   ├── prompt/            # Individual prompt pages
│   ├── user/              # User dashboard
│   ├── layout.tsx         # Root layout with SEO
│   ├── robots.ts          # Search engine rules
│   ├── sitemap.ts         # Dynamic sitemap
│   └── manifest.ts        # PWA manifest
├── components/             # React components
│   ├── SEO/               # SEO components
│   ├── ui/                # UI components
│   └── *.tsx              # Feature components
├── lib/                   # Utility libraries
│   ├── seo/               # SEO utilities
│   └── supabase/          # Database clients
├── public/                # Static assets
└── styles/                # Global styles
```

## 🎯 SEO Features

### ✅ Implemented SEO Optimizations

- **100% Metadata Coverage** - Dynamic metadata for all pages
- **Structured Data** - Organization, Website, Article, FAQ schemas
- **Canonical URLs** - Automatic canonical link generation
- **Robots.txt** - Comprehensive search engine rules
- **Dynamic Sitemap** - Auto-generated with all routes
- **Breadcrumb Navigation** - Clear site hierarchy
- **Open Graph & Twitter Cards** - Rich social sharing
- **Core Web Vitals** - Optimized performance metrics

### 🤖 AI Search Optimization

- **Semantic HTML5** - Proper document structure
- **Clear Heading Hierarchy** - H1-H6 structure
- **FAQ Schema** - Direct answer formatting
- **Author Attribution** - Clear content ownership
- **Descriptive Summaries** - AI-friendly content

## ⚡ Performance Features

### Core Web Vitals Optimization

- **Next.js Image** - Lazy loading and optimization
- **Font Preloading** - Critical font optimization
- **React Performance Hooks** - useMemo, useCallback
- **Component Splitting** - Server/client optimization
- **Minimal Hydration** - Reduced client-side JavaScript

### Accessibility

- **ARIA Labels** - Screen reader support
- **Keyboard Navigation** - Full accessibility
- **Semantic Elements** - Proper HTML5 structure
- **WCAG Compliance** - Accessibility standards

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/myasirghaffar/PromptVault.git
   cd PromptVault
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # SEO Configuration
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   GOOGLE_SITE_VERIFICATION=your_google_verification_code
   YANDEX_VERIFICATION=your_yandex_verification_code
   ```

4. **Set up Supabase database**
   - Run the SQL scripts in `/scripts/` directory
   - Configure authentication settings
   - Set up storage buckets for images

5. **Run development server**

   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

## 📊 Environment Variables

| Variable                    | Description                        | Required |
| --------------------------- | ---------------------------------- | -------- |
| `NEXT_PUBLIC_SUPABASE_URL`  | Supabase project URL               | ✅       |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key          | ✅       |
| `NEXT_PUBLIC_SITE_URL`      | Production site URL                | ✅       |
| `GOOGLE_SITE_VERIFICATION`  | Google Search Console verification | ❌       |
| `YANDEX_VERIFICATION`       | Yandex Webmaster verification      | ❌       |

## 🚀 Deployment

### Vercel Deployment

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Deploy PromptVault"
   git push origin main
   ```

2. **Connect to Vercel**
   - Import repository in Vercel
   - Add environment variables
   - Deploy automatically

### Environment Setup

1. **Configure domain** in Vercel dashboard
2. **Set up SSL** certificate
3. **Submit sitemap** to Google Search Console
4. **Monitor Core Web Vitals** in Vercel Analytics

## 📈 SEO Performance

### Expected Scores

- **Lighthouse SEO**: 95-100
- **Lighthouse Performance**: 90-95
- **Lighthouse Accessibility**: 95-100
- **Core Web Vitals**: All green

### Monitoring Tools

- **Google Search Console** - Search performance
- **Vercel Analytics** - User analytics
- **Vercel Speed Insights** - Core Web Vitals
- **Lighthouse CI** - Automated testing

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open Pull Request**

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[v0.dev](https://v0.dev)** - AI-powered UI generation
- **[Supabase](https://supabase.com)** - Backend as a Service
- **[Vercel](https://vercel.com)** - Hosting platform
- **[Next.js](https://nextjs.org)** - React framework

## 📞 Support

For support and questions:

- 📧 **Email**: support@promptvault.dev
- 🐛 **Issues**: [GitHub Issues](https://github.com/myasirghaffar/PromptVault/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/myasirghaffar/PromptVault/discussions)

---

**Built with ❤️ for the AI community**
