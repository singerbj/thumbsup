"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Home, FolderOpen, ThumbsUp, Settings, Layers, Menu, X } from "lucide-react"

const navigationItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: Home,
    badge: null,
  },
  {
    name: "Workstreams",
    href: "/workstreams",
    icon: Layers,
    badge: null,
  },
  {
    name: "Projects",
    href: "/projects",
    icon: FolderOpen,
    badge: null,
  },
  {
    name: "My Approvals",
    href: "/approvals",
    icon: ThumbsUp,
    badge: "pending",
  },
  {
    name: "Rules Engine",
    href: "/rules",
    icon: Settings,
    badge: null,
  },
]

interface SideNavigationProps {
  badges?: Record<string, number>
}

export function SideNavigation({ badges = {} }: SideNavigationProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  const getBadgeCount = (item: any) => {
    if (item.badge === "pending") {
      return badges.approvals || 0
    }
    return badges[item.name.toLowerCase()] || 0
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white shadow-md"
        >
          {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Side Navigation */}
      <div
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-40 transform transition-transform duration-200 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo and App Name */}
          <div className="flex items-center space-x-3 p-6 border-b border-gray-200">
            <span className="text-2xl">👍</span>
            <div>
              <h1 className="text-xl font-bold text-gray-900">ThumbsUp</h1>
              <p className="text-xs text-gray-500">Social Media Approval</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                const badgeCount = getBadgeCount(item)

                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                        active ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </div>
                      {badgeCount > 0 && (
                        <Badge variant={active ? "default" : "secondary"} className="text-xs">
                          {badgeCount}
                        </Badge>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* User Profile Section */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">JD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
                <p className="text-xs text-gray-500 truncate">john@company.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
