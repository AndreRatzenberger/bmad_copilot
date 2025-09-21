<!-- Front-End Specification (UX Expert) -->
# Front-End Specification: Research Catalog Database
Version: v0.1 (Draft)  
Derived From: `prd.md` v0.1  
Design Mode: Dark-first, minimalist research console; emphasize information density without clutter.

## 1. Goals
1. Enable rapid triage of enriched research items with minimal cognitive overhead.
2. Provide frictionless theory exploration workflow (input → evidence classification → actionable refinement).
3. Maintain performance perceptions: immediate skeleton states, progressive hydration, zero layout shift.
4. Scaffold future advanced visualization (graph, timeline) without re-architecting core layout.

## 2. Information Architecture
Top-Level Areas:
- Dashboard (/): recent items, ingestion status, cluster summary, quick actions.
- Search (/search): unified multi-entity search + filters.
- Item Detail (/item/:type/:id): deep metadata + similar panel.
- Theory Explorer (/theory): input, evidence split view, suggestions.
- URL Analyze (/analyze): single-shot enrichment.
- Admin (/admin): ingestion controls, metrics snapshot.
Global Layout:
- Left Sidebar (collapsible): Navigation + status badges + cluster quick filter toggle.
- Main Content: Routed views.
- Right Utility Panel (contextual, hidden on narrow viewports): Similar items / cluster composition / theory suggestions.
- Footer: Build hash (for debugging), API health indicator.

## 3. Navigation & Routing
Routing Strategy: Client-side (React Router).  
Preloading: Prefetch item detail data when user hovers card (optimistic navigation).  
Error Boundaries: Local per route + global fallback with reload CTA.

## 4. Visual Language & Theming
Color Palette (Dark Mode Default):
- Background: #0E1116
- Surface: #161B22 / elevated #1F242C
- Accent Primary: #3B82F6 (info) / Secondary #6366F1
- Semantic: Success #10B981, Warning #F59E0B, Danger #EF4444
Typography:
- Base: System font stack (Inter if added) 14px root; 1.15 line-height.
Density: Slightly compact for research workflows (8px base spacing scale; 4px sub-scale).
Score Badges: Dual ring (outer color-coded gradient by score band; inner numeric).  
Tags: Rounded pill with low-chroma background (#243045) and subtle hover (#2E3B52).

## 5. Layout & Responsive Behavior
Breakpoints: sm (640), md (880), lg (1200), xl (1600).  
Desktop: 3-column potential (nav / main / utility).  
Tablet: Collapse utility; move similar items below content.  
Mobile: Single-column; nav becomes top hamburger sheet.
Use CSS container queries for card density adaptation.

## 6. Key Screens & Flows
### 6.1 Dashboard
Modules:
- Recent Activity Stream (latest N items, mixed type with type icon chips).
- Ingestion Status Panel (poll interval, last run, queued, active, paused badge).
- Cluster Snapshot (top 5 clusters by new items; simple bar chart or stacked tags).
- Quick Actions: [Search] [Theory Explorer] [Analyze URL] [Pause/Resume Ingestion].
Interactions:
- Click cluster summary → pre-filter search with cluster id.
- Hover item → prefetch detail & similar.

### 6.2 Search View
Regions:
- Query Bar (debounced input, entity toggle chips, cluster filter dropdown, tag multi-select inline).  
- Results Grid/List toggle (default list).  
- Facet Sidebar: Clusters, Tags (top 15 by frequency), Score Range slider.  
- Result Item Card (see Component Library).
Empty State Types:
1. No query yet → onboarding hint (example queries).  
2. No results → Suggest related tags + offer “Expand Ingestion Burst” (button triggers targeted ingestion API if implemented).  
Infinite Scroll OR Paged: Start with pageable (simpler) + load next page CTA.

### 6.3 Item Detail
Sections (accordion-friendly on mobile):
1. Header: Title, entity type badge, scores.
2. Summary & Findings (with toggle Raw vs Refined if later variant emerges).
3. Questions Answered (badge list).
4. Tags (click → search with tag filter added).
5. Similar Items Panel (right side desktop / below on mobile; shows top 8).  
6. Graph Context (MVP placeholder: list of connected cluster label + counts; future visual embed area).
7. Metadata: Published date (paper), stars (repo), ingestion timestamps, enrichment version.
Actions:
- Copy citation (paper) (stub early).  
- Reprocess (if admin mode flagged).

### 6.4 Theory Explorer
Layout: Two-column (Support | Contradict) with dynamic grid; suggestions drawer below if sparse.  
Input Pattern: Large top input with “Evidence Threshold” advanced option (collapsed).  
After Submit: show progress indicator (animated step: retrieving → classifying → aggregating).  
Each Evidence Card: relevance snippet, confidence badge (color-coded), quick open detail link.
Sparse Outcome: Show related theory suggestions (chips) + “Trigger targeted ingestion?” CTA.

### 6.5 URL Analyze
Single input (accepts PDF URL or GitHub repo).  
State Machine: IDLE → QUEUED → ENRICHING → COMPLETE.  
Display placeholder skeleton card with spinner until enrichment finishes—auto-refresh poll every 2s (cap 30s then fallback manual refresh).

### 6.6 Admin
Tiles: Ingestion Control (Pause/Resume), Metrics (counts & avg times), Clustering (last run, items, runtime), Cost (estimated tokens).  
Potential Danger Zone: Force reprocess form.

## 7. Component Library (Initial Set)
| Component | Purpose | Notes |
|-----------|---------|-------|
| AppShell | Layout skeleton | Accepts nav + main + aside slots |
| SidebarNav | Primary navigation | Collapsible, retains state in localStorage |
| StatusBadge | System/ingestion statuses | Color + icon variants |
| EntityCard | Search/Dashboard card | Condensed summary + scores + tags |
| ScoreBadge | Visual scoring | Dual ring + tooltip rationale snippet |
| TagChip | Tag display/filter action | Click adds/updates search filters |
| TheoryInput | Prominent theory entry | Includes advanced threshold panel |
| EvidenceColumn | Column wrapper for support/contradict | Handles empty & loading states |
| EvidenceCard | Evidence item | Shows confidence, snippet, open link |
| SimilarList | Similar items | Horizontal scroller or stacked list |
| ClusterFacet | Cluster filter UI | Possibly list + counts + color token |
| PaginationBar | Page navigation | Numbered + next/prev |
| LoadingSkeleton | Placeholder shimmer | Variants: card, list, detail |
| MetricTile | Admin metrics | Value + sparkline (stretch) |
| ToggleGroup | Entity type filter | Accessible segmented control |
| ConfirmationModal | Critical admin actions | Esc + trap focus |

Accessibility & A11y Notes:
- All interactive elements reachable via Tab order; visual focus ring (#2563EB).  
- Color contrast: WCAG AA (check score badge hues).  
- Reduced motion setting disables heavy transitions (prefers-reduced-motion media query).  
Keyboard Shortcuts (MVP optional): `s` focus search, `t` open theory explorer, `/` from anywhere focuses global search.

## 8. State Management & Data Fetching
Approach: React Query (TanStack Query) for server state + lightweight Zustand (or React Context) for UI ephemeral state (theme, layout prefs).  
Cache TTLs:
- Search queries: 60s staleTime; prefetch next page on near-end scroll.
- Item details: 5 min staleTime with background refetch.
- Ingestion status: Poll every 15s.
Optimistic Prefetch: On link hover (desktop) for item detail + similar.

## 9. API Consumption Contracts (Frontend Expectations)
Search Response (example skeleton):
```json
{
  "page": 1,
  "page_size": 20,
  "total": 312,
  "results": [
    {"id":"p_abc123","type":"paper","title":"...","summary":"...","tags":["rl"],"scores":{"relevance":8,"interesting":9},"cluster_id":5},
    {"id":"r_xyz789","type":"repo","title":"...","summary":"...","tags":["vision"],"scores":{"relevance":6,"interesting":7},"cluster_id":2}
  ],
  "clusters":[{"id":5,"label":"optimization-general","count":124}],
  "timings":{"query_ms":42}
}
```
Item Detail Minimum Fields:
```json
{
  "id":"p_abc123",
  "type":"paper",
  "title":"Example Paper",
  "summary":"...",
  "findings":["..."],
  "questions":["..."],
  "tags":["rl","model"],
  "scores":{"relevance":8,"interesting":9,"rationale":{"relevance":"...","interesting":"..."}},
  "cluster_id":5,
  "similar":[{"id":"p_def456","type":"paper","title":"...","scores":{"relevance":7,"interesting":8}}],
  "metadata":{"published_at":"2025-09-01","ingested_at":"2025-09-21T12:30:00Z","enrichment_version":1}
}
```
Theory Query Response:
```json
{
  "theory":"Transformers still underperform for long-context reasoning",
  "supports":[{"id":"p_1","title":"...","confidence":"high","snippet":"..."}],
  "contradicts":[{"id":"p_7","title":"...","confidence":"medium","snippet":"..."}],
  "related_suggestions":["Hierarchical memory architectures","Sparse attention efficiency"],
  "timings":{"classification_ms":850}
}
```

## 10. Interaction Patterns & Microcopy
Microcopy Tone: Neutral-analytical. Avoid hype adjectives.  
Examples:
- Empty Search: “No results. Adjust filters or refine your query.”
- Theory Sparse: “Limited evidence found. Related directions:”
- Pause Ingestion Confirm: “Ingestion loops will stop after current tasks finish.”
- Reprocess Tooltip: “Re-run enrichment with current prompt version.”

## 11. Loading, Error & Skeleton Strategy
Skeleton Types: Card row (3 lines + badges), detail summary (title bar + paragraphs), table stub for theory columns.  
Fallback Strategy: If theory classification > 5s show interim message “Classifying evidence… (LLM)” with streaming dots.
Error Patterns:
- Network: toast + silent background retry for idempotent GETs.
- Hard failure (500): inline panel with request ID (if provided) + retry button.

## 12. Performance & UX Budget
Targets:
- First Contentful Paint < 1.2s (local dev baseline).  
- Search render < 150ms after JSON arrival.  
- Hover prefetch budget < 200ms (abort if network slow).  
Client Bundle Strategy:
- Code split: /theory and /admin lazy loaded.  
- Shared component chunk (< 120 KB gzip).  
- Tailwind JIT purge for production.

## 13. Accessibility & Inclusive Design
- Score color encodings also include text (e.g., “Relevance 8/10”).  
- Theory support/contradict columns use ARIA landmark roles (region + label).  
- All charts (if any cluster bars) provide text alternatives.  
- Keyboard reveals suggestion chips (arrow keys + Enter).  

## 14. Security & Privacy (Frontend Surface)
- No API key exposure; only backend endpoints.  
- Rate limiting feedback: if 429, show “Temporarily throttled. Auto retrying…”  
- Avoid storing large payloads in localStorage (cache only UI prefs).  

## 15. Extensibility Hooks
Planned Future Slots:
- Graph Visualization Panel (Item Detail) placeholder div with data attributes.
- Timeline Tab (Cluster growth) stub route returning “Coming Soon”.  
- Export Button location reserved in Search header (disabled state).

## 16. Implementation Recommendations
- Use React Query for server state; central `apiClient` wrapper handles base URL + error shaping.  
- Create a `usePrefetchItem(id)` hook for hover preloading detail + similar in parallel.  
- Normalize API data via lightweight selectors before passing to components.  
- Maintain a `ClusterColorScale` utility (stable across sessions).  
- Provide a `ScoreInterpreter` utility mapping numeric bands to descriptors (e.g., 8–10 = “High Impact”).

## 17. Open UX Questions (Non-Blocking)
- Should clusters get human-friendly generated labels (top tags) vs numeric IDs (MVP numeric with tooltip tag summary).  
- Do we need a side-by-side diff for reprocessed enrichment (stretch)?  
- Should theory evidence confidence become adjustable threshold filter? (defer)

## 18. Acceptance Criteria (UX-Specific)
- All interactive elements focusable + visible focus ring.
- Search results keyboard navigation (ArrowDown/Up) cycles cards; Enter opens detail.
- Theory Explorer: submitting identical theory twice caches result (no spinner) for 2 minutes.
- Loading skeleton appears for any API call > 250ms (debounce threshold) to prevent flicker.

## 19. Delivery Artifacts
- Component hierarchy diagram (TBD in architecture doc).
- Style tokens JSON (colors, spacing, typography scale) (stretch).
- Example screenshot mocks (if time) — not required pre-architecture.

## 20. Handoff to Architecture
Architecture must define: API latency budgets, clustering job interface, item similarity retrieval strategy, streaming vs polling for long-running theory classification (MVP: polling).

---
# AI UI Generation Prompt (For Tools Like v0 / Lovable)
Use this prompt verbatim (adjust branding if needed):

"""
Design a dark-mode first responsive research console web app called "Research Catalog" with the following core routes: Dashboard, Search, Item Detail, Theory Explorer, URL Analyze, Admin. Use a compact, information-dense layout suitable for technical users.

Overall Goals:
- Rapid triage of AI research papers + related repos.
- Theory exploration: show supporting vs contradicting evidence.
- Unified search across papers and repos with clustering facets.

Layout:
- Left collapsible sidebar (logo: minimal hexagon + "Research Catalog") with nav items (Dashboard, Search, Theory, Analyze, Admin) and status section at bottom (ingestion state badge + build hash placeholder).
- Main content area with card-based lists and subtle surface elevation.
- Optional right utility panel for similar items or theory suggestions (hidden on mobile).

Components:
- Entity Card: title, type badge (Paper/Repo), short summary (2 lines clamp), tags (max 4), dual score badges (relevance & interestingness) with color-coded rings.
- Score Badge: circular with outside gradient ring (green→yellow→red for high→low), numeric center, tooltip showing rationale placeholder.
- Theory Explorer: top large input (placeholder: "Enter a theory or question..."), submit button. Two responsive columns: Supporting Evidence, Contradicting Evidence. Each evidence card: title, snippet, confidence badge (High/Med/Low), open button.
- Search Filters: chips for entity type toggles, cluster dropdown, tag multi-select (combobox), score range slider.
- URL Analyze form: input + Analyze button, result card placeholder with spinner state.
- Admin tiles: curved cards showing ingestion status (running/paused), counts, cluster job last run, token cost estimate.

Visual Style:
- Dark background (#0E1116), surfaces (#161B22, elevated #1F242C), accent blues (#3B82F6 primary, #6366F1 secondary).
- Tags: pill, subtle navy background (#243045), hover slightly brighter (#2E3B52).
- Fonts: Inter or system sans, 14px base, tight leading.
- Spacing scale: 4 / 8 / 12 / 16.

Interactions:
- Hover card reveals quick action icons (open detail, copy ID).
- Cards prefetch detail data on hover.
- Skeleton loaders for lists (3 shimmer rows) and detail (title bar + paragraphs) appear if load > 250ms.
- Keyboard shortcuts: / focuses search, t opens theory page, s selects search input, p toggles pause ingestion (if on Admin page focus context).

Accessibility:
- All interactive elements keyboard accessible with visible focus ring.
- Sufficient contrast on tags and score badges (WCAG AA).
- Provide ARIA labels for score badges: "Relevance score 8 out of 10".

Mobile:
- Sidebar collapses to top nav bar + overflow menu.
- Theory columns stack vertically (Supporting first, then Contradicting) with anchor jump links.

Do NOT implement backend logic—scaffold UI with placeholder data loaders and props.
Keep code modular with a components/ directory and hooks/ for data placeholders.
"""

---
End of Front-End Spec v0.1
