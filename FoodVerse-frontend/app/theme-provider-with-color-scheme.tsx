"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import { useEffect } from "react"

export function ThemeProviderWithColorScheme({ children, ...props }: ThemeProviderProps) {
  // This effect adds a class to handle color scheme preference at the OS level
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    // Function to update the color-scheme meta tag
    const updateColorScheme = (isDark: boolean) => {
      document.documentElement.style.setProperty("color-scheme", isDark ? "dark" : "light")
    }

    // Initial setup
    updateColorScheme(mediaQuery.matches)

    // Listen for changes
    const listener = (e: MediaQueryListEvent) => updateColorScheme(e.matches)
    mediaQuery.addEventListener("change", listener)

    return () => mediaQuery.removeEventListener("change", listener)
  }, [])

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

