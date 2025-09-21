"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

export function useKeyboardShortcuts() {
  const router = useRouter()
  const pathname = usePathname()
  const [showHelp, setShowHelp] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only trigger if not in an input field
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement ||
        (event.target as HTMLElement)?.contentEditable === "true"
      ) {
        return
      }

      // Handle modifier combinations first
      if (event.metaKey || event.ctrlKey) {
        switch (event.key) {
          case "k":
            event.preventDefault()
            // Focus search input or go to search
            const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement
            if (searchInput) {
              searchInput.focus()
            } else {
              router.push("/search")
            }
            break
          case "/":
            event.preventDefault()
            setShowHelp(!showHelp)
            break
        }
        return
      }

      // Handle single key shortcuts
      switch (event.key) {
        case "/":
          event.preventDefault()
          // Focus search input if available, otherwise go to search page
          const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement
          if (searchInput) {
            searchInput.focus()
          } else {
            router.push("/search")
          }
          break

        case "t":
          event.preventDefault()
          router.push("/theory")
          break

        case "c":
          event.preventDefault()
          router.push("/clusters")
          break

        case "s":
          event.preventDefault()
          // If already on search page, focus the search input
          if (pathname === "/search") {
            const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement
            if (searchInput) {
              searchInput.focus()
              searchInput.select()
            }
          } else {
            router.push("/search")
          }
          break

        case "a":
          event.preventDefault()
          router.push("/analyze")
          break

        case "d":
          event.preventDefault()
          router.push("/")
          break

        case "p":
          // Context-sensitive: only on admin page
          if (pathname === "/admin") {
            event.preventDefault()
            // Toggle pause ingestion
            const pauseButton = document.querySelector('[data-action="toggle-pause"]') as HTMLButtonElement
            if (pauseButton) {
              pauseButton.click()
            } else {
              console.log("Toggle pause ingestion")
            }
          }
          break

        case "?":
          event.preventDefault()
          setShowHelp(!showHelp)
          break

        case "Escape":
          event.preventDefault()
          if (showHelp) {
            setShowHelp(false)
          } else {
            // Clear any active selections or close modals
            const activeElement = document.activeElement as HTMLElement
            if (activeElement && activeElement.blur) {
              activeElement.blur()
            }
          }
          break

        case "g":
          // Wait for second key for "go to" shortcuts
          event.preventDefault()
          const handleSecondKey = (secondEvent: KeyboardEvent) => {
            secondEvent.preventDefault()
            document.removeEventListener("keydown", handleSecondKey)

            switch (secondEvent.key) {
              case "h":
                router.push("/")
                break
              case "s":
                router.push("/search")
                break
              case "t":
                router.push("/theory")
                break
              case "a":
                router.push("/analyze")
                break
              case "c":
                router.push("/clusters")
                break
              case "m":
                router.push("/admin")
                break
            }
          }

          // Add temporary listener for second key
          setTimeout(() => {
            document.addEventListener("keydown", handleSecondKey, { once: true })
          }, 0)

          // Remove listener after 2 seconds if no second key pressed
          setTimeout(() => {
            document.removeEventListener("keydown", handleSecondKey)
          }, 2000)
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [router, pathname, showHelp])

  return { showHelp, setShowHelp }
}
