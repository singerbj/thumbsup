import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { QueryProvider } from "@/components/query-provider"
import { SideNavigation } from "@/components/side-navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ThumbsUp - Social Media Approval Platform",
  description: "Streamline your social media content approval process with intuitive workflows",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <QueryProvider>
            <div className="flex h-screen bg-gray-50">
              <SideNavigation badges={{ approvals: 3 }} />
              <main className="flex-1 lg:ml-64 overflow-auto">{children}</main>
            </div>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
