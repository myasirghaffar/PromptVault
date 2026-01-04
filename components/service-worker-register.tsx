"use client"

import { useEffect } from "react"

/**
 * Service Worker Registration Component
 * Registers the service worker for PWA functionality
 * Only runs on client-side to prevent hydration issues
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      // Register service worker
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered successfully:", registration.scope)
          
          // Check for updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  // New service worker available, prompt user to refresh
                  console.log("New service worker available. Please refresh the page.")
                }
              })
            }
          })
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error)
        })

      // Handle service worker updates
      let refreshing = false
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!refreshing) {
          refreshing = true
          window.location.reload()
        }
      })
    }
  }, [])

  return null
}

