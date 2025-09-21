"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check, ChevronDown, X, Filter } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SearchFilters {
  entityTypes: ("Paper" | "Repo")[]
  cluster: string
  tags: string[]
  relevanceRange: [number, number]
  interestingnessRange: [number, number]
}

interface SearchFiltersProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  className?: string
}

const availableTags = [
  "machine-learning",
  "neural-networks",
  "attention",
  "transformers",
  "computer-vision",
  "nlp",
  "deep-learning",
  "reinforcement-learning",
  "generative-ai",
  "optimization",
]

const clusters = [
  { value: "all", label: "All Clusters" },
  { value: "attention-mechanisms", label: "Attention Mechanisms" },
  { value: "computer-vision", label: "Computer Vision" },
  { value: "nlp-models", label: "NLP Models" },
  { value: "optimization", label: "Optimization" },
  { value: "generative-models", label: "Generative Models" },
]

export function SearchFilters({ filters, onFiltersChange, className }: SearchFiltersProps) {
  const [tagSearchOpen, setTagSearchOpen] = useState(false)

  const toggleEntityType = (type: "Paper" | "Repo") => {
    const newTypes = filters.entityTypes.includes(type)
      ? filters.entityTypes.filter((t) => t !== type)
      : [...filters.entityTypes, type]
    onFiltersChange({ ...filters, entityTypes: newTypes })
  }

  const toggleTag = (tag: string) => {
    const newTags = filters.tags.includes(tag) ? filters.tags.filter((t) => t !== tag) : [...filters.tags, tag]
    onFiltersChange({ ...filters, tags: newTags })
  }

  const removeTag = (tag: string) => {
    onFiltersChange({ ...filters, tags: filters.tags.filter((t) => t !== tag) })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      entityTypes: ["Paper", "Repo"],
      cluster: "all",
      tags: [],
      relevanceRange: [0, 10],
      interestingnessRange: [0, 10],
    })
  }

  const hasActiveFilters =
    filters.entityTypes.length < 2 ||
    filters.cluster !== "all" ||
    filters.tags.length > 0 ||
    filters.relevanceRange[0] > 0 ||
    filters.relevanceRange[1] < 10 ||
    filters.interestingnessRange[0] > 0 ||
    filters.interestingnessRange[1] < 10

  return (
    <div className={cn("space-y-4", className)}>
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Filters</span>
          {hasActiveFilters && (
            <Badge variant="secondary" className="text-xs">
              Active
            </Badge>
          )}
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs h-7">
            Clear All
          </Button>
        )}
      </div>

      {/* Entity Type Toggles */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">Entity Type</Label>
        <div className="flex gap-2">
          {(["Paper", "Repo"] as const).map((type) => (
            <Button
              key={type}
              variant={filters.entityTypes.includes(type) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleEntityType(type)}
              className="h-8 text-xs"
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      {/* Cluster Dropdown */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">Cluster</Label>
        <Select value={filters.cluster} onValueChange={(value) => onFiltersChange({ ...filters, cluster: value })}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {clusters.map((cluster) => (
              <SelectItem key={cluster.value} value={cluster.value}>
                {cluster.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tag Multi-Select */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">Tags</Label>
        <Popover open={tagSearchOpen} onOpenChange={setTagSearchOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-9 justify-between text-left font-normal bg-transparent">
              <span className="text-xs">
                {filters.tags.length > 0 ? `${filters.tags.length} selected` : "Select tags..."}
              </span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0" align="start">
            <Command>
              <CommandInput placeholder="Search tags..." className="h-9" />
              <CommandList>
                <CommandEmpty>No tags found.</CommandEmpty>
                <CommandGroup>
                  {availableTags.map((tag) => (
                    <CommandItem key={tag} onSelect={() => toggleTag(tag)} className="text-xs">
                      <Check className={cn("mr-2 h-3 w-3", filters.tags.includes(tag) ? "opacity-100" : "opacity-0")} />
                      {tag}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Selected Tags */}
        {filters.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {filters.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                  aria-label={`Remove ${tag} tag`}
                >
                  <X className="h-2 w-2" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Score Range Sliders */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">
            Relevance Score: {filters.relevanceRange[0]} - {filters.relevanceRange[1]}
          </Label>
          <Slider
            value={filters.relevanceRange}
            onValueChange={(value) => onFiltersChange({ ...filters, relevanceRange: value as [number, number] })}
            max={10}
            min={0}
            step={1}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">
            Interestingness Score: {filters.interestingnessRange[0]} - {filters.interestingnessRange[1]}
          </Label>
          <Slider
            value={filters.interestingnessRange}
            onValueChange={(value) => onFiltersChange({ ...filters, interestingnessRange: value as [number, number] })}
            max={10}
            min={0}
            step={1}
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}
