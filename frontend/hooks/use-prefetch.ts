"use client"

import { useState, useCallback } from "react"

interface PrefetchOptions {
  delay?: number
  enabled?: boolean
}

export function usePrefetch(options: PrefetchOptions = {}) {
  const { delay = 100, enabled = true } = options
  const [prefetchedItems, setPrefetchedItems] = useState<Set<string>>(new Set())
  const [isPrefetching, setIsPrefetching] = useState(false)

  const prefetch = useCallback(
    async (id: string, prefetchFn: () => Promise<void>) => {
      if (!enabled || prefetchedItems.has(id) || isPrefetching) return

      setIsPrefetching(true)

      try {
        await new Promise((resolve) => setTimeout(resolve, delay))
        await prefetchFn()
        setPrefetchedItems((prev) => new Set(prev).add(id))
      } catch (error) {
        console.warn("Prefetch failed:", error)
      } finally {
        setIsPrefetching(false)
      }
    },
    [enabled, prefetchedItems, isPrefetching, delay],
  )

  const clearPrefetchCache = useCallback(() => {
    setPrefetchedItems(new Set())
  }, [])

  return {
    prefetch,
    isPrefetching,
    prefetchedItems,
    clearPrefetchCache,
  }
}
