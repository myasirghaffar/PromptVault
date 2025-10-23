import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Suspense } from "react"
import PWAInstallPrompt from "../components/pwa-install-prompt"

export const metadata: Metadata = {
  title: "PromptVault - Discover Amazing AI Prompts",
  description: "Browse our curated collection of high-quality prompts for ChatGPT, Midjourney, and more",
  generator: "v0.app",
  manifest: "/manifest.json",
  themeColor: "#000000",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PromptVault",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "PromptVault",
    title: "PromptVault - Discover Amazing AI Prompts",
    description: "Browse our curated collection of high-quality prompts for ChatGPT, Midjourney, and more",
  },
  twitter: {
    card: "summary",
    title: "PromptVault - Discover Amazing AI Prompts",
    description: "Browse our curated collection of high-quality prompts for ChatGPT, Midjourney, and more",
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    shortcut: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="application-name" content="PromptVault" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="PromptVault" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />
        
        <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-192x192.png" />
        
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/icons/icon-192x192.png" color="#000000" />
        <link rel="shortcut icon" href="/favicon.ico" />
        
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://promptvault.app" />
        <meta name="twitter:title" content="PromptVault - Discover Amazing AI Prompts" />
        <meta name="twitter:description" content="Browse our curated collection of high-quality prompts for ChatGPT, Midjourney, and more" />
        <meta name="twitter:image" content="/icons/icon-192x192.png" />
        <meta name="twitter:creator" content="@promptvault" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="PromptVault - Discover Amazing AI Prompts" />
        <meta property="og:description" content="Browse our curated collection of high-quality prompts for ChatGPT, Midjourney, and more" />
        <meta property="og:site_name" content="PromptVault" />
        <meta property="og:url" content="https://promptvault.app" />
        <meta property="og:image" content="/icons/icon-512x512.png" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased flex flex-col min-h-screen`}>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <PWAInstallPrompt />
        <Analytics />
      </body>
    </html>
  )
}
