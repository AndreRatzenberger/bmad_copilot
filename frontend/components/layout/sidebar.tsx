"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Search, Lightbulb, LinkIcon, Settings, Menu, X, Hexagon, Map } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Search", href: "/search", icon: Search },
  { name: "Theory", href: "/theory", icon: Lightbulb },
  { name: "Analyze", href: "/analyze", icon: LinkIcon },
  { name: "Clusters", href: "/clusters", icon: Map },
  { name: "Admin", href: "/admin", icon: Settings },
]

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setIsCollapsed(true)} />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-50 h-full bg-sidebar border-r border-sidebar-border transition-all duration-300",
          isCollapsed ? "w-16" : "w-64",
          "lg:relative lg:z-auto",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
            <div className={cn("flex items-center gap-3 transition-opacity", isCollapsed && "lg:opacity-0")}>
              <Hexagon className="h-6 w-6 text-sidebar-primary" />
              <span className="font-semibold text-sidebar-foreground">Research Catalog</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-8 w-8 p-0 text-sidebar-foreground hover:bg-sidebar-accent lg:hidden"
            >
              {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-ring",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isCollapsed && "justify-center lg:justify-start",
                  )}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  <span className={cn("transition-opacity", isCollapsed && "lg:opacity-0 lg:w-0 lg:overflow-hidden")}>
                    {item.name}
                  </span>
                </Link>
              )
            })}
          </nav>

          {/* Status Section */}
          <div className="border-t border-sidebar-border p-4">
            <div className={cn("space-y-2 transition-opacity", isCollapsed && "lg:opacity-0")}>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-xs text-sidebar-foreground">Ingestion Active</span>
              </div>
              <div className="text-xs text-muted-foreground">Build: abc123def</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
