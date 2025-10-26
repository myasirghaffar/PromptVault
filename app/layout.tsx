import type React from "react"
import type { Metadata, Viewport } from "next"
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
    icon: "/icons/icon-192x192.svg",
    shortcut: "/icons/icon-192x192.svg",
    apple: "/icons/icon-192x192.svg",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-152x152.svg" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.svg" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-192x192.svg" />
        <link rel="mask-icon" href="/icons/icon-192x192.svg" color="#000000" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased flex flex-col min-h-screen`}>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <PWAInstallPrompt />
        <Analytics />
      </body>
    </html>
  )
}
