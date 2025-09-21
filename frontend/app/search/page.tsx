"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { EntityCard } from "@/components/ui/entity-card"
import { ListSkeleton } from "@/components/ui/skeleton-loader"
import { SearchFilters, type SearchFilters as SearchFiltersType } from "@/components/search/search-filters"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useMockEntities } from "@/hooks/use-mock-data"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { Search, SlidersHorizontal } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export default function SearchPage() {
  const { entities, loading } = useMockEntities(20)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<SearchFiltersType>({
    entityTypes: ["Paper", "Repo"],
    cluster: "all",
    tags: [],
    relevanceRange: [0, 10],
    interestingnessRange: [0, 10],
  })
  const [filteredEntities, setFilteredEntities] = useState(entities)

  useKeyboardShortcuts()

  // Filter entities based on search query and filters
  useEffect(() => {
    let filtered = entities

    // Text search
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (entity) =>
          entity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entity.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entity.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Entity type filter
    if (filters.entityTypes.length > 0 && filters.entityTypes.length < 2) {
      filtered = filtered.filter((entity) => filters.entityTypes.includes(entity.type))
    }

    // Tag filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter((entity) => filters.tags.some((tag) => entity.tags.includes(tag)))
    }

    // Score range filters
    filtered = filtered.filter(
      (entity) =>
        entity.relevanceScore >= filters.relevanceRange[0] &&
        entity.relevanceScore <= filters.relevanceRange[1] &&
        entity.interestingnessScore >= filters.interestingnessRange[0] &&
        entity.interestingnessScore <= filters.interestingnessRange[1],
    )

    setFilteredEntities(filtered)
  }, [entities, searchQuery, filters])

  const rightPanel = (
    <div className="space-y-6">
      <SearchFilters filters={filters} onFiltersChange={setFilters} />

      <div>
        <h3 className="font-medium text-foreground mb-3">Similar Items</h3>
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">Based on your current search</div>
          {["Attention Is All You Need", "BERT: Pre-training Transformers", "GPT-3: Language Models are Few-Shot"].map(
            (title, i) => (
              <div
                key={i}
                className="p-2 bg-card border border-border rounded text-xs hover:bg-card-elevated cursor-pointer"
              >
                {title}
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  )

  return (
    <MainLayout rightPanel={rightPanel}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Search</h1>
          <p className="text-muted-foreground">Search across papers and repositories with advanced filtering</p>
        </div>

        {/* Search Bar */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search papers, repositories, authors, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Mobile Filter Toggle */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="xl:hidden bg-transparent">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <SearchFilters filters={filters} onFiltersChange={setFilters} />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm">
          <div className="text-muted-foreground">
            {loading ? "Loading..." : `${filteredEntities.length} results found`}
            {searchQuery && (
              <span>
                {" "}
                for "<span className="text-foreground font-medium">{searchQuery}</span>"
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Sort by:</span>
            <Button variant="ghost" size="sm" className="h-7 text-xs">
              Relevance
            </Button>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <ListSkeleton count={6} />
        ) : filteredEntities.length > 0 ? (
          <div className="space-y-4">
            {filteredEntities.map((entity) => (
              <EntityCard
                key={entity.id}
                entity={entity}
                onDetailClick={(id) => {
                  console.log("Navigate to detail:", id)
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No results found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setFilters({
                  entityTypes: ["Paper", "Repo"],
                  cluster: "all",
                  tags: [],
                  relevanceRange: [0, 10],
                  interestingnessRange: [0, 10],
                })
              }}
            >
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
