"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface KeyboardHelpProps {
  isOpen: boolean
  onClose: () => void
}

const shortcuts = [
  {
    category: "Navigation",
    items: [
      { keys: ["/"], description: "Focus search" },
      { keys: ["t"], description: "Open theory page" },
      { keys: ["c"], description: "Open cluster map" },
      { keys: ["s"], description: "Go to search / focus search input" },
      { keys: ["a"], description: "Open analyze page" },
      { keys: ["d"], description: "Go to dashboard" },
    ],
  },
  {
    category: "Go To (g + key)",
    items: [
      { keys: ["g", "h"], description: "Go to home/dashboard" },
      { keys: ["g", "s"], description: "Go to search" },
      { keys: ["g", "t"], description: "Go to theory" },
      { keys: ["g", "a"], description: "Go to analyze" },
      { keys: ["g", "c"], description: "Go to clusters" },
      { keys: ["g", "m"], description: "Go to admin" },
    ],
  },
  {
    category: "Search",
    items: [
      { keys: ["Cmd", "K"], description: "Quick search" },
      { keys: ["/"], description: "Focus search input" },
    ],
  },
  {
    category: "Context Actions",
    items: [{ keys: ["p"], description: "Toggle pause ingestion (admin page only)" }],
  },
  {
    category: "General",
    items: [
      { keys: ["?"], description: "Show/hide this help" },
      { keys: ["Cmd", "/"], description: "Toggle help" },
      { keys: ["Esc"], description: "Close help / clear selection" },
    ],
  },
]

export function KeyboardHelp({ isOpen, onClose }: KeyboardHelpProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg">Keyboard Shortcuts</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {shortcuts.map((category) => (
            <div key={category.category}>
              <h3 className="font-medium text-sm text-muted-foreground mb-3 uppercase tracking-wide">
                {category.category}
              </h3>
              <div className="space-y-2">
                {category.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-1">
                    <span className="text-sm">{item.description}</span>
                    <div className="flex items-center gap-1">
                      {item.keys.map((key, keyIndex) => (
                        <div key={keyIndex} className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs font-mono px-2 py-1">
                            {key === "Cmd" ? "⌘" : key === "Esc" ? "Esc" : key}
                          </Badge>
                          {keyIndex < item.keys.length - 1 && <span className="text-xs text-muted-foreground">+</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Press{" "}
              <Badge variant="outline" className="text-xs font-mono px-1">
                ?
              </Badge>{" "}
              or{" "}
              <Badge variant="outline" className="text-xs font-mono px-1">
                Esc
              </Badge>{" "}
              to close this help.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
