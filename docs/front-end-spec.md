<!-- Front-End Specification (UX Expert) -->
# Front-End Specification: Research Catalog Database
# Implementation Status Addendum (v0.1 POC Assessment)
> This addendum documents the current frontend proof-of-concept implementation (Next.js app) as of 2025-09-22 and gaps versus the original specification. It is appended without altering original spec intent.

## Route / Feature Status Summary
| Area / Route | Status | Notes |
|--------------|--------|-------|
| Global Layout & Sidebar | Partial | Sidebar + status present; footer absent; right utility panel pattern partially present; no persistent footer build hash. |
| Dashboard | Partial | Recent items (mock), quick stats, recent activity, quick actions done; missing cluster snapshot & ingestion pause/resume inline. |
| Search | Partial | Query input, mixed results mock, filters side panel scaffold; missing real data, pagination/infinite strategy, empty states, view toggle, proper tag multi-select, keyboard nav. |
| Item Detail | Missing | No /item/:id route; similar items only implied in search side panel (not detail context). |
| Theory Explorer | Scaffold | Input + suggestions + empty state; missing evidence results columns, analysis states, confidence badges. |
| URL Analyze | Scaffold | Input + example URLs; missing state machine, progress, result insertion, polling. |
| Admin | Partial | Metrics tiles and actions present; missing model configuration tables, cost/dimension modals, audit log, reindex banner. |
| Cluster Map | Placeholder | Toolbar + sliders + help text only; no WebGL/canvas, zoom/pan, lasso, density overlay. |
| Model Config (LLM/Embedding) | Missing | Not implemented anywhere. |
| Accessibility Enhancements | Missing | Need ARIA roles for regions, score badge labels, keyboard navigation patterns. |
| Performance Budgets | N/A | Not measurable with static mock content. |
| State Management (React Query/Zustand) | Missing | Current Next.js POC uses static/mock data; no query client integration. |
| Keyboard Shortcuts | Missing/Unknown | Not verified; no visible bindings beyond placeholder comment in spec. |
| Cluster Map Advanced Interactions | Missing | Lasso, density, point LOD not started. |

## Component Implementation Coverage
| Component (Spec) | Status | Notes |
|------------------|--------|-------|
| AppShell | Partial | Layout split exists but not abstracted as reusable component. |
| SidebarNav / Sidebar | Done | Functional, collapsible (mobile toggle) with status. |
| StatusBadge | Partial | Ingestion Active text only; needs dedicated badge component abstraction. |
| EntityCard | Partial | Card UI present with actions; scores & tags present but styling differs from dual ring spec. |
| ScoreBadge | Missing | Scores rendered as plain numeric sections, not ring gradient component. |
| TagChip | Partial | Tags appear as simple labels; interactive filter behavior absent. |
| TheoryInput | Scaffold | Input & helper text present, lacks advanced threshold panel & submit logic. |
| EvidenceColumn / EvidenceCard | Missing | Not built; empty state placeholder only. |
| SimilarList | Partial | "Similar Items" concept appears only in Search right panel; not tied to detail view logic. |
| ClusterFacet | Missing | Cluster dropdown placeholder only, no counts. |
| PaginationBar | Missing | Not implemented; static list. |
| LoadingSkeleton | Partial | Some skeleton components exist (needs audit), but not consistently applied per latency rules. |
| MetricTile | Partial | Tiles rendered, may need abstraction & accessibility roles. |
| ToggleGroup (entity type) | Partial | Buttons present, need semantic radio-group behavior. |
| ConfirmationModal | Missing | No modals for admin actions yet. |
| ClusterMapCanvas / Toolbar | Placeholder | Toolbar partial; canvas w/ interactions absent. |
| LassoLayer | Missing | Not started. |
| MapTooltip | Missing | Not started. |
| DensityLegend | Missing | Not started. |
| MiniMap | Missing | Not started. |
| ModelSelectorTable | Missing | Not started. |
| ModelSelectModal / DimensionWarning / CostBadge | Missing | Not started. |
| AuditLogList | Missing | Not started. |

## Priority Gap Remediation Plan (Recommended Order)
1. Implement Item Detail route (unblocks multiple stories: similar items, score rationale, tag navigation).
2. Integrate React Query + API client scaffolding (search, item detail, theory analyze, url analyze, status endpoints).
3. Theory evidence pipeline UI (support/contradict columns & cards) with placeholder mocked fetch layer.
4. Cluster Map MVP (static point canvas + zoom/pan) before advanced lasso & density layers.
5. Model Configuration panel (LLM & Embeddings) with mock data and selection flows (cost + dimension warnings).
6. Accessibility & keyboard navigation pass (focus order, ARIA labels, shortcuts bindings).
7. Performance instrumentation (measure hydration, search render times) once real queries exist.
8. Enhancement of ScoreBadge + standardized TagChip & MetricTile components.

## Frontend Tracking Metadata
- Assessment Date: 2025-09-22
- Assessed By: Automated review agent (POC instrumentation via Playwright DOM snapshots)
- Next Update Target: After Item Detail + React Query integration.

---

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
 - Cluster Map (/clusters): interactive semantic 2D projection of papers & repos (zoom/pan, hover tooltips, lasso select → filter pipe into Search view).
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

Model Configuration Panel (new subsection):
- LLM Model Selector: table/list with columns (Model ID, Provider, Context Window, Cost /1K tokens, Status).  
- Embedding Model Selector: table/list with columns (Model ID, Provider, Dimension, Cost /1K tokens, Active?).  
- Active model rows highlighted; inactive rows have “Select” button.  
- Upon selection attempt → preflight test call spinner (LLM) or dimension validation (Embedding).  
- If embedding dimension mismatch → show modal: "Dimension mismatch (current: 1536, new: 3072). Force switch will mark existing similarities stale until re-embed. Continue?"  
- Cost Increase Warning: If (new model cost / current cost) - 1 >= threshold (default 0.35) show yellow warning badge in confirmation modal.  
- Post-switch toast: “Active LLM model updated to gpt-4.1-mini (v5).”  
- Display read-only audit list (last 5 model changes with timestamp + user label placeholder).

### 6.7 Cluster Map
Purpose: Spatial exploration & discovery of emergent topical neighborhoods beyond faceted list scanning.
Data Source: `/clusters/map` endpoint – returns projection coordinates (x,y in normalized [-1,1] or 0..1), cluster_id, minimal metadata, projection_version.
Rendering Strategy:
- Layer 1: Base scatter (WebGL / canvas batch).  
- Layer 2: Density overlay (optional toggle) using grid aggregation or kernel density (fast approximate).  
- Layer 3: Interaction overlay (SVG or Canvas) for lasso path + selected hull highlight.  
Interactions:
- Zoom (wheel / pinch) + Pan (drag background).  
- Hover point → tooltip (title, scores, top tag).  
- Click point → open detail drawer (or navigate to Item Detail).  
- Lasso (hold Shift + drag) to select region → convert to search filter (list of IDs or cluster / tag inference when > threshold).  
- Density toggle & point size slider (range: auto / small / medium).  
Performance Targets:
- Initial render ≤ 1.2s for ≤ 5K points; maintain ≥ 45 FPS on typical laptop GPU.  
- Degrade gracefully > 10K points: switch to aggregated heat cells until zoom threshold reveals individual nodes.  
Stability:
- Only re-fetch when `projection_version` changes.  
- Persist last camera transform in session (localStorage) under `clusterMapViewState`.
Accessibility:
- Keyboard navigation: cycle nearest points with Arrow keys when map focused.  
- Screen-reader fallback list for currently selected / hovered item.

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
| ClusterMapCanvas | High-perf scatter / heat rendering | WebGL or performant canvas; supports point LOD |
| ClusterMapToolbar | Map controls | Zoom reset, density toggle, point size slider |
| LassoLayer | Handles region selection | Emits bounding polygon + item IDs |
| MapTooltip | Hover detail | Portal positioned, keyboard accessible |
| DensityLegend | Explains heat color scale | Hidden when density off |
| MiniMap (stretch) | Overview inset | Shows current viewport rectangle |
| ModelSelectorTable | Lists LLM or embedding models | Reusable with column config |
| ModelSelectModal | Confirm model switch | Shows cost diff, warnings |
| CostBadge | Visual indicator of relative token cost | Color-coded tiers |
| DimensionWarning | Embedding mismatch alert | Provides force switch CTA |
| AuditLogList | Recent admin model changes | Paginated (stretch) |

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
 - Cluster map points: treat as stable for a projection_version (staleTime = Infinity until version change endpoint field).
Optimistic Prefetch: On link hover (desktop) for item detail + similar.
Projection Version Handling:
- Separate query key: [`cluster-map`, projection_version].  
- If version mismatch detected (status endpoint or map metadata), invalidate & refetch.
Lasso Selection Flow:
1. User draws polygon → get selected item IDs (or aggregated cluster counts).  
2. Heuristic: if selected IDs > 150, convert to derived filter (clusters + top tags) instead of enumerating IDs.  
3. Dispatch navigation to `/search` with encoded filter state.

Model Config State:
- Query keys: [`models`, `llm`], [`models`, `embeddings`], [`models`, `active`].  
- Optimistic update avoided (require server confirmation).  
- On successful switch: invalidate affected queries + increment local version store; optionally show inline diff metrics (enrichment queue now tagged with new version).
Version Propagation:
- `llm_model_version` & `embedding_model_version` fetched with active call and passed via context for conditional ribbons (e.g., “New model active” badges on recent items).  
Force Switch Flow (Embedding):
1. User selects incompatible dimension model.  
2. Show `DimensionWarning` modal with impact summary.  
3. If confirmed with force → POST select endpoint `{ force: true }`; show toast about reindex requirement.  
4. UI sets global flag `reindexRequired=true` (banner shown in Search & Dashboard).

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
Cluster Map Response (example):
```json
{
  "projection_version": 3,
  "generated_at": "2025-09-21T14:20:00Z",
  "points": [
    {"id":"p_abc123","type":"paper","cluster_id":5,"x":0.412,"y":-0.221,"scores":{"relevance":8,"interesting":9},"tag":"rl"},
    {"id":"r_xyz789","type":"repo","cluster_id":2,"x":-0.118,"y":0.665,"scores":{"relevance":6,"interesting":7},"tag":"vision"}
  ],
  "bounds": {"minX":-1,"maxX":1,"minY":-1,"maxY":1},
  "meta": {"total": 5231, "clusters": 37}
}
```
Hover Detail Optimization: Accept batch query of up to 16 IDs if richer tooltip detail needed beyond base payload.
Model Listing (LLM example):
```json
[
  {"id":"gpt-4.1-mini","provider":"openai","context":128000,"cost_per_1k_tokens":{"input":0.003,"output":0.006},"available":true},
  {"id":"gpt-4o","provider":"openai","context":128000,"cost_per_1k_tokens":{"input":0.005,"output":0.015},"available":true}
]
```
Active Models:
```json
{
  "llm":{"id":"gpt-4.1-mini","version":5},
  "embedding":{"id":"text-embedding-3-large","dimension":3072,"version":2},
  "flags":{"reindex_required":false}
}
```
Select Response (LLM):
```json
{"status":"ok","active":{"llm":"gpt-4.1-mini","version":6}}
```
Embedding Switch (force mismatch):
```json
{"status":"ok","active":{"embedding":"text-embedding-3-large"},"reindex_required":true}
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
 - Model list load < 400ms for ≤ 25 models; selection round-trip < 2s including test call.
Client Bundle Strategy:
- Code split: /theory and /admin lazy loaded.  
- Shared component chunk (< 120 KB gzip).  
- Tailwind JIT purge for production.

## 13. Accessibility & Inclusive Design
- Score color encodings also include text (e.g., “Relevance 8/10”).  
- Theory support/contradict columns use ARIA landmark roles (region + label).  
- All charts (if any cluster bars) provide text alternatives.  
- Keyboard reveals suggestion chips (arrow keys + Enter).  
 - Cluster map: Provide aria-live region announcing selection counts; provide fallback list rendering of last 10 hovered or selected items.
 - Model tables: ensure column headers announced; selection buttons have aria-label "Select LLM model {id}".

## 14. Security & Privacy (Frontend Surface)
- No API key exposure; only backend endpoints.  
- Rate limiting feedback: if 429, show “Temporarily throttled. Auto retrying…”  
- Avoid storing large payloads in localStorage (cache only UI prefs).  

## 15. Extensibility Hooks
Planned Future Slots:
- Graph Visualization Panel (Item Detail) placeholder div with data attributes.
- Timeline Tab (Cluster growth) stub route returning “Coming Soon”.  
- Export Button location reserved in Search header (disabled state).
 - Cluster Map future overlays: temporal slider, theory edge overlay, similarity filter gradient.
 - Model config: placeholder tab for future prompt template editing & caching policies.

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
 - What minimum zoom threshold triggers switch from aggregated heat to individual points?  
 - Should we allow multi-lasso additive selection? (defer to v0.2)  
 - Would temporal color encoding (age gradient) improve discovery or add noise? (evaluate after initial usage)
 - Should we persist cost baseline per model to show historical trend?  
 - Do we need a dry-run diff viewer for enrichment output between models (stretch)?

## 18. Acceptance Criteria (UX-Specific)
- All interactive elements focusable + visible focus ring.
- Search results keyboard navigation (ArrowDown/Up) cycles cards; Enter opens detail.
- Theory Explorer: submitting identical theory twice caches result (no spinner) for 2 minutes.
- Loading skeleton appears for any API call > 250ms (debounce threshold) to prevent flicker.
 - Cluster map initial load spinner replaced by canvas within 1.2s (≤5K points test corpus).
 - Hover tooltip appears within ≤ 50ms after pointer stops moving (debounced at 30ms).
 - Lasso selection with ≤ 2K points in view completes polygon classification < 120ms.
 - Zoom interaction maintains ≥ 45 FPS (profiling baseline) at 5K points; degrade mode (heat aggregation) auto-activates > 10K points.
 - Projection version change triggers unobtrusive toast: “Cluster map updated (vX)” and smoothly cross-fades to new positions (no abrupt pop).
 - Model switch shows confirmation modal if cost delta > threshold OR dimension mismatch.  
 - Selecting compatible embedding model updates active display without warning modal.  
 - Force embedding switch sets global reindex banner visible across routes until dismissed post reindex.

## 19. Delivery Artifacts
- Component hierarchy diagram (TBD in architecture doc).
- Style tokens JSON (colors, spacing, typography scale) (stretch).
- Example screenshot mocks (if time) — not required pre-architecture.

## 20. Handoff to Architecture
Architecture must define: API latency budgets, clustering job interface, item similarity retrieval strategy, streaming vs polling for long-running theory classification (MVP: polling), projection pipeline (UMAP vs PCA fallback), projection_version emission, level-of-detail aggregation thresholds, and batching strategy for hover detail enrichment.

---
# AI UI Generation Prompt (For Tools Like v0 / Lovable)
Use this prompt verbatim (adjust branding if needed):

"""
Design a dark-mode first responsive research console web app called "Research Catalog" with the following core routes: Dashboard, Search, Item Detail, Theory Explorer, URL Analyze, Admin, Clusters. Use a compact, information-dense layout suitable for technical users.

Overall Goals:
- Rapid triage of AI research papers + related repos.
- Theory exploration: show supporting vs contradicting evidence.
- Unified search across papers and repos with clustering facets.
- Spatial discovery via an interactive semantic cluster map (zoom/pan, hover, lasso select) to identify emergent research neighborhoods.

Layout:
- Left collapsible sidebar (logo: minimal hexagon + "Research Catalog") with nav items (Dashboard, Search, Theory, Analyze, Clusters, Admin) and status section at bottom (ingestion state badge + build hash placeholder).
- Main content area with card-based lists and subtle surface elevation.
- Optional right utility panel for similar items or theory suggestions (hidden on mobile).
- Clusters page: large central WebGL/canvas map, toolbar (zoom reset, density toggle, point size slider), optional density heat overlay, lasso selection overlay, mini-map (optional).

Components:
- Entity Card: title, type badge (Paper/Repo), short summary (2 lines clamp), tags (max 4), dual score badges (relevance & interestingness) with color-coded rings.
- Score Badge: circular with outside gradient ring (green→yellow→red for high→low), numeric center, tooltip showing rationale placeholder.
- Theory Explorer: top large input (placeholder: "Enter a theory or question..."), submit button. Two responsive columns: Supporting Evidence, Contradicting Evidence. Each evidence card: title, snippet, confidence badge (High/Med/Low), open button.
- Search Filters: chips for entity type toggles, cluster dropdown, tag multi-select (combobox), score range slider.
- URL Analyze form: input + Analyze button, result card placeholder with spinner state.
- Admin tiles: curved cards showing ingestion status (running/paused), counts, cluster job last run, token cost estimate.
- Cluster Map: performant WebGL scatter with pan/zoom (trackpad + scroll), density heat overlay toggle, hover tooltip, lasso selection (Shift + drag) converting selection to filter chips, point size scaling by score band (optional), legend for density scale.
 - Model Configuration Panel: two responsive tables:
   * LLM Models Table (columns: Model ID, Provider, Context Window, Input $/1K, Output $/1K, Status/Select action)
   * Embedding Models Table (columns: Model ID, Provider, Dimension, $/1K tokens, Active?)
   * Active rows visually highlighted; non-active show a “Select” button.
   * CostBadge component (color tiers: green <= baseline, amber <= +35%, red > +35%).
   * Dimension mismatch modal (force switch warning message + consequences list).
   * AuditLog list (last 5 switches: timestamp, model id, type, version).
   * Reindex Required Banner (appears after forced embedding dimension change) persistent across routes until dismissed.

Visual Style:
- Dark background (#0E1116), surfaces (#161B22, elevated #1F242C), accent blues (#3B82F6 primary, #6366F1 secondary).
- Tags: pill, subtle navy background (#243045), hover slightly brighter (#2E3B52).
- Fonts: Inter or system sans, 14px base, tight leading.
- Spacing scale: 4 / 8 / 12 / 16.

Interactions:
- Hover card reveals quick action icons (open detail, copy ID).
- Cards prefetch detail data on hover.
- Cluster map hover shows tooltip; clicking opens detail view; lasso select produces selection bar with “Filter in Search” button.
- Skeleton loaders for lists (3 shimmer rows) and detail (title bar + paragraphs) appear if load > 250ms.
- Keyboard shortcuts: / focuses search, t opens theory page, c opens cluster map, s selects search input, p toggles pause ingestion (if on Admin page focus context).
 - Model selection: click Select → preflight spinner (simulate test call) → confirmation modal if cost delta > threshold or dimension mismatch.
 - Force embedding switch sets global reindex banner with link to “Learn more”.
 - Hover model row shows tooltip with extended provider notes (placeholder).

Accessibility:
- All interactive elements keyboard accessible with visible focus ring.
- Sufficient contrast on tags and score badges (WCAG AA).
- Provide ARIA labels for score badges: "Relevance score 8 out of 10".
 - Tables: proper <table>/<thead>/<tbody>; each Select button has aria-label “Select LLM model {id}” or “Select embedding model {id}”.
 - Reindex banner announced via aria-live polite on appearance.

Mobile:
- Sidebar collapses to top nav bar + overflow menu.
- Theory columns stack vertically (Supporting first, then Contradicting) with anchor jump links.
- Cluster map switches to simplified mode: aggregated heat cells; tap to expand area; lasso disabled (fallback to tap-select multi via long-press).
 - Model tables collapse to card list (stacked) with key metrics; Select action remains primary button at bottom of card.

Do NOT implement backend logic—scaffold UI with placeholder data loaders and props.
Keep code modular with a components/ directory and hooks/ for data placeholders.
Maintain performance: prefer instanced rendering for points; degrade to aggregation automatically at scale.
 Provide mock data JSON for model tables; implement state placeholders for active model and reindex banner.
"""

---
End of Front-End Spec v0.1
