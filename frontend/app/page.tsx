"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { EntityCard } from "@/components/ui/entity-card"
import { ListSkeleton } from "@/components/ui/skeleton-loader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useMockEntities } from "@/hooks/use-mock-data"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { Search, TrendingUp, Clock, BookOpen, GitBranch } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { entities, loading } = useMockEntities(6)
  useKeyboardShortcuts()

  const recentEntities = entities.slice(0, 6)
  const paperCount = entities.filter((e) => e.type === "Paper").length
  const repoCount = entities.filter((e) => e.type === "Repo").length

  const rightPanel = (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-foreground mb-3">Quick Stats</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg">
            <BookOpen className="h-4 w-4 text-primary" />
            <div>
              <div className="text-sm font-medium">1,247</div>
              <div className="text-xs text-muted-foreground">Papers</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg">
            <GitBranch className="h-4 w-4 text-secondary" />
            <div>
              <div className="text-sm font-medium">892</div>
              <div className="text-xs text-muted-foreground">Repositories</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <div>
              <div className="text-sm font-medium">156</div>
              <div className="text-xs text-muted-foreground">This Week</div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium text-foreground mb-3">Recent Activity</h3>
        <div className="space-y-2">
          {[
            "New paper: Attention mechanisms in NLP",
            "Repository updated: transformer-pytorch",
            "Theory explored: Multi-head attention",
            "URL analyzed: arxiv.org/abs/1706.03762",
          ].map((activity, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span className="text-xs">{activity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <MainLayout rightPanel={rightPanel}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground text-balance">Research Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening with your research catalog.</p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/analyze">
                <Search className="h-4 w-4 mr-2" />
                Analyze URL
              </Link>
            </Button>
            <Button asChild>
              <Link href="/search">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Search */}
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Quick search papers and repositories... (Press / to focus)"
                className="pl-10 bg-background"
              />
            </div>
            <Button>Search</Button>
          </div>
          <div className="flex gap-2 mt-3">
            <span className="text-xs text-muted-foreground">Popular:</span>
            {["transformers", "attention", "neural networks", "deep learning"].map((tag) => (
              <button
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-tag-bg text-foreground hover:bg-tag-hover transition-colors focus-ring"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Entities */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-foreground">Recently Added</h2>
            <Button variant="outline" size="sm" asChild>
              <Link href="/search">View All</Link>
            </Button>
          </div>

          {loading ? (
            <ListSkeleton count={3} />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {recentEntities.map((entity) => (
                <EntityCard
                  key={entity.id}
                  entity={entity}
                  onDetailClick={(id) => {
                    console.log("Navigate to detail:", id)
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/theory"
            className="group bg-card border border-border rounded-lg p-4 hover:bg-card-elevated transition-colors focus-ring"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-medium text-foreground">Theory Explorer</h3>
            </div>
            <p className="text-sm text-muted-foreground">Explore theories with supporting and contradicting evidence</p>
          </Link>

          <Link
            href="/analyze"
            className="group bg-card border border-border rounded-lg p-4 hover:bg-card-elevated transition-colors focus-ring"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Search className="h-4 w-4 text-secondary" />
              </div>
              <h3 className="font-medium text-foreground">URL Analyzer</h3>
            </div>
            <p className="text-sm text-muted-foreground">Analyze research papers and repositories from URLs</p>
          </Link>

          <Link
            href="/admin"
            className="group bg-card border border-border rounded-lg p-4 hover:bg-card-elevated transition-colors focus-ring"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Clock className="h-4 w-4 text-green-500" />
              </div>
              <h3 className="font-medium text-foreground">System Status</h3>
            </div>
            <p className="text-sm text-muted-foreground">Monitor ingestion and system health</p>
          </Link>
        </div>
      </div>
    </MainLayout>
  )
}
