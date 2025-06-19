"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface BreadcrumbProps {
  customItems?: Array<{
    label: string
    href?: string
  }>
  badge?: {
    label: string
    count: number
  }
}

export function Breadcrumb({ customItems, badge }: BreadcrumbProps) {
  const pathname = usePathname()

  const generateBreadcrumbs = () => {
    if (customItems) {
      return customItems
    }

    const segments = pathname.split("/").filter(Boolean)
    const breadcrumbs = [{ label: "Dashboard", href: "/" }]

    let currentPath = ""
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`

      // Convert segment to readable label
      let label = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

      // Handle special cases
      if (segment === "workstreams") label = "Workstreams"
      if (segment === "approvals") label = "My Approvals"
      if (segment === "rules") label = "Rules Engine"
      if (segment === "content") label = "Content"

      // Don't add href for the last segment (current page)
      breadcrumbs.push({
        label,
        href: index === segments.length - 1 ? undefined : currentPath,
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <div className="flex items-center justify-between">
      <nav className="flex items-center space-x-2 text-sm">
        {breadcrumbs.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
            {item.href ? (
              <Link href={item.href} className="text-gray-600 hover:text-gray-900 transition-colors">
                {index === 0 && <Home className="w-4 h-4 mr-1 inline" />}
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 font-medium">
                {index === 0 && <Home className="w-4 h-4 mr-1 inline" />}
                {item.label}
              </span>
            )}
          </div>
        ))}
      </nav>

      {badge && (
        <Badge variant="secondary" className="text-sm">
          {badge.count} {badge.label}
        </Badge>
      )}
    </div>
  )
}
