import type React from "react";
import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { Suspense } from "react";
import PWAInstallPrompt from "../components/pwa-install-prompt";
import { generateMetadata, seoConfig } from "../lib/seo/metadata-builder";
import { PageSEO } from "../components/SEO/PageSEO";

export const metadata: Metadata = generateMetadata({
  title: seoConfig.defaultTitle,
  description: seoConfig.defaultDescription,
  canonical: seoConfig.siteUrl,
  keywords: [
    "AI prompts",
    "ChatGPT",
    "Midjourney",
    "Gemini",
    "prompt engineering",
    "AI tools",
  ],
  type: "website",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-152x152.svg" />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/icons/icon-152x152.svg"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/icon-192x192.svg"
        />
        <link
          rel="apple-touch-icon"
          sizes="167x167"
          href="/icons/icon-192x192.svg"
        />
        <link rel="mask-icon" href="/icons/icon-192x192.svg" color="#000000" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <PageSEO />
      </head>
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased flex flex-col min-h-screen`}
        suppressHydrationWarning
      >
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <PWAInstallPrompt />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
