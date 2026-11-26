import type { Metadata } from "next"
import Script from "next/script"
import localFont from "next/font/local"

import { ThemeProvider } from "@/components/theme/theme-provider"
import { themeBootstrapScript } from "@/lib/theme"
import { sidebarBootstrapScript } from "@/lib/ui-preferences"
import { cn } from "@/lib/utils"

import "./globals.css"

const dmSans = localFont({
  src: [
    { path: "./fonts/DMSans-variable.ttf", weight: "100 1000", style: "normal" },
    { path: "./fonts/DMSans-Italic-variable.ttf", weight: "100 1000", style: "italic" },
  ],
  variable: "--font-dm-sans",
  weight: "100 1000",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Morrow",
    template: "%s · Morrow",
  },
  description:
    "Make something of today. A personal-first, AI-assisted content workspace.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full antialiased",
        dmSans.variable,
        "font-sans"
      )}
      data-theme="light"
      style={{ colorScheme: "light" }}
    >
      <head>
        <Script
          id="morrow-theme-bootstrap"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeBootstrapScript }}
        />
        <Script
          id="morrow-sidebar-bootstrap"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: sidebarBootstrapScript }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
