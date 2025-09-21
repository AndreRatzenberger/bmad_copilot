"use client"

import type React from "react"

import { Sidebar } from "./sidebar"
import { KeyboardHelp } from "@/components/ui/keyboard-help"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"

interface MainLayoutProps {
  children: React.ReactNode
  rightPanel?: React.ReactNode
}

export function MainLayout({ children, rightPanel }: MainLayoutProps) {
  const { showHelp, setShowHelp } = useKeyboardShortcuts()

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 overflow-auto p-6">{children}</main>

        {/* Right utility panel */}
        {rightPanel && (
          <aside className="hidden xl:block w-80 border-l border-border bg-card p-6 overflow-auto">{rightPanel}</aside>
        )}
      </div>

      <KeyboardHelp isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  )
}
