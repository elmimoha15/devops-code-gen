import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Roboto_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto-mono",
})

export const metadata: Metadata = {
  title: "DevOps Configuration Generator",
  description: "Generate Dockerfiles and Kubernetes manifests with ease",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={robotoMono.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

