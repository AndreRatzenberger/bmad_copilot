import { Skeleton } from "@/components/ui/skeleton"

export default function ClustersLoading() {
  return (
    <div className="flex h-full flex-col">
      {/* Toolbar skeleton */}
      <div className="flex items-center justify-between border-b border-border bg-card p-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-6 w-24" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 bg-background">
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
              <div className="text-sm text-muted-foreground">Loading cluster map...</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
