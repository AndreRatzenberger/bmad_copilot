<!-- Draft PRD generated from project brief (Phase: PM) -->
# Product Requirements Document (PRD)
Project: Research Catalog Database  
Status: Draft (v0.1)  
Origin Sources: `project-brief.md` + user clarifications (2025-09-21)

## 1. Product Overview
The Research Catalog Database is a platform for continuous ingestion and semantic enrichment of AI research papers (arXiv) and related GitHub repositories. It exposes unified search, similarity exploration, and theory-driven evidence aggregation. MVP focuses on reliable ingestion + enrichment + search + theory mode; clustering and scoring provide differentiating insight beyond existing tooling.

## 2. Objectives & Success Metrics
Primary Objectives:
1. Enable rapid discovery of relevant and novel research & code around a topic/theory.
2. Provide explainable enrichment (summaries, tags, findings, dual scores) to reduce manual triage.
3. Allow hypothesis/theory exploration with support vs. contradiction breakdown.

Success Metrics (MVP; tracked in internal metrics dashboard):
- Search median latency < 300 ms for corpus < 5K items.
- ≥ 2K enriched items by end of Month 1.
- ≥ 70% of theory queries return at least one support or contradict item within first week of corpus growth.
- Enrichment 95th percentile processing time ≤ 7 minutes.

## 3. Scope
In Scope (MVP):
- Continuous paper ingestion (arXiv categories: cs.AI, cs.LG, stat.ML).
- Repo discovery (GitHub keyword/topic search; manual curated term list) with 20 candidate repos/day target.
- LLM enrichment (summary, tags, questions, findings, rationale-backed scores).
- Embedding + tag based similarity graph; periodic clustering.
- Unified search API & UI (papers + repos + theory results).
- Theory mode with support/contradict classification.
- Single URL analysis (paper PDF or repo) with immediate enrichment.
- Sparse result fallback: suggest related theories OR trigger targeted ingestion (controlled).
- Dark-mode first web UI (React + Vite + Tailwind if allowed).
 - Interactive cluster visualization (semantic 2D projection with zoom/pan, hover detail, click to open item, cluster density shading, lasso multi-select to filter search).
 - Runtime configurable LLM and embedding model selection (via lite-llm layer) from Admin UI.

Out of Scope (MVP):
- User accounts / personalization.
- Citation graph ingestion.
- Alerting / notifications.
- External DB (remain on TinyDB + local files).
- Lexical fallback index (no fuzzy search beyond simple filtering).
- Advanced multi-layer theory + similarity force-directed overlays (beyond base cluster map), live physics manipulation, temporal playback.

Future / Stretch Candidates:
- Subscription alerting.
- Full citation network & citation-based scoring.
- ANN index (Faiss / hnswlib) after >10K items.
- Export datasets (CSV/JSON).
- Interactive cluster & concept map UI.

## 4. User Personas & Needs
1. Research Engineer: Fast triage of new publications + code alignment.
2. Product / Strategy Analyst: Validate direction with evidence clusters.
3. Academic / Advanced Student: Map topical landscape & novel contributions.
4. Technical Investor: Track emergent themes & practical relevance.

## 5. Functional Requirements
### 5.1 Ingestion
FR-ING-1: System polls arXiv every 30 minutes for configured categories.  
FR-ING-2: System polls GitHub at least every 2 hours, retrieving candidate repos via defined keyword/topic queries (rate-limit aware).  
FR-ING-3: Deduplicate by arXiv ID version and GitHub full_name.  
FR-ING-4: Failed fetch attempts retried with exponential backoff (max 3).  
FR-ING-5: Items enter enrichment queue immediately upon successful fetch metadata.

### 5.2 Enrichment
FR-ENR-1: For each item, system generates structured JSON including summary, tags[], questions[], findings[], scores{relevance, interesting}, rationale.  
FR-ENR-2: Embedding generated for text representation (paper: title+abstract; repo: README + file name sample).  
FR-ENR-3: Skip embedding if text length < minimal threshold (config).  
FR-ENR-4: Store enrichment artifacts in TinyDB; embeddings stored in local `embeddings/` directory.  
FR-ENR-5: Score rubric deterministic prompt with reproducible temperature (≤ 0.2).  
FR-ENR-6: Re-processing guard prevents duplicate enrichment unless forced.

### 5.3 Graph & Similarity
FR-GRAPH-1: System maintains similarity edges for top N (config, default 15) nearest neighbor items per node above cosine threshold.  
FR-GRAPH-2: Supports PAPER_IMPL_BY_REPO edge inference (heuristic: repository references arXiv ID or >2 distinctive keywords).  
FR-GRAPH-3: Clustering job runs every 4 hours.  
FR-GRAPH-4: Cluster assignments stored and exposed via search facets.  
FR-GRAPH-5: Each clustering cycle computes or refreshes 2D projection coordinates (UMAP preferred; PCA fallback) persisted per item with projection version.  
FR-GRAPH-6: Projection jitter minimized by deterministic item ordering + fixed random seed.

### 5.4 Theory Mode
FR-THY-1: User submits a theory/question string.  
FR-THY-2: System produces supporting and contradicting item sets (classification via LLM few-shot prompt referencing summary + findings).  
FR-THY-3: Counts, representative items, and confidence indicators returned.  
FR-THY-4: If total evidence < configurable minimum (default 3), system suggests related theories (embedding neighbors of query) OR proposes targeted ingestion focusing on high-signal keywords.  
FR-THY-5: Theories optionally persisted for later revisit.

### 5.5 Search & Retrieval
FR-SRCH-1: Unified endpoint supports filtering by entity type (paper, repo) and cluster.  
FR-SRCH-2: Ranking formula: weighted composite (cosine + tag overlap + recency + interestingness).  
FR-SRCH-3: Response includes pagination metadata.  
FR-SRCH-4: Similar items (at least top 5) included in detail view payload.  
FR-SRCH-5: URL analysis endpoint accepts paper PDF link or GitHub repo URL; returns enriched item + similar results.
FR-SRCH-6: Cluster map endpoint exposes: list of items (id, type, cluster_id, x, y, scores.relevance, scores.interesting, top tag).  
FR-SRCH-7: Lasso selection payload (front-end only) translates to filter parameters for search results view.  
FR-SRCH-8: Hover detail endpoint (or reuse item detail minimal) returns condensed fields (#requests optimized by batching IDs within animation frame).

### 5.6 Administration
FR-ADM-1: Endpoint to pause/resume ingestion loops.  
FR-ADM-2: Endpoint to trigger on-demand re-cluster.  
FR-ADM-3: Endpoint to force re-enrichment of an item (for prompt iteration).  
FR-ADM-4: Configuration values (intervals, thresholds) readable via API; mutable only if flagged (stretch).
FR-ADM-5: Endpoint to manually trigger projection recompute separate from clustering (for troubleshooting) (rate-limited).
FR-ADM-6: Endpoint to list available LLM completion models (provider, name, context_window, cost_estimates).  
FR-ADM-7: Endpoint to list available embedding models (dimension, provider, cost_estimates).  
FR-ADM-8: Endpoint to set active LLM model (validates with lite-llm test call).  
FR-ADM-9: Endpoint to set active embedding model (reject if dimension differs from existing index unless force flag).  
FR-ADM-10: Endpoint to fetch current active models + version numbers.  
FR-ADM-11: (Stretch) Endpoint to dry-run enrichment with prospective model (not persisted) returning diff summary.

## 6. Non-Functional Requirements
NFR-PERF-1: Search median latency < 300 ms for corpus < 5K items (cold start excluded).  
NFR-PERF-2: Enrichment throughput: sustain 10 items concurrently without exceeding rate limits.  
NFR-RELI-1: Ingestion loops auto-restart on uncaught exceptions.  
NFR-COST-1: Daily embedding + LLM cost below preset budget ceiling (configurable; baseline assumption).  
NFR-OBS-1: Logging includes correlation IDs per item pipeline.  
NFR-OBS-2: Basic metrics (ingested_count, failed_count, avg_enrichment_time, cluster_job_duration).  
NFR-SEC-1: API key not exposed to client; backend only.  
NFR-STOR-1: Disk growth monitored; PDF retention toggle default ON; prune job optional.  
NFR-MAINT-1: Code modular, each service layer <= 500 lines target for maintainability.

## 7. Data Model (Summary)
See `project-brief.md` Section 9; PRD additions: add field `cluster_id` to Paper/Repo; add optional `evidence_vector` to Theory records for faster future queries.

## 8. API Endpoints (Initial Draft)
| Method | Path | Purpose |
|--------|------|---------|
| GET | /health | Liveness/ready check |
| GET | /search | Unified search (query, type filters, cluster, pagination) |
| GET | /item/{type}/{id} | Fetch enriched entity detail |
| POST | /analyze/url | Analyze single paper or repo URL |
| POST | /theory/query | Run theory exploration (not persisted) |
| POST | /theory/save | Persist a theory definition |
| GET | /theory/{id} | Retrieve stored theory & current evidence snapshot |
| POST | /admin/ingestion/pause | Pause loops |
| POST | /admin/ingestion/resume | Resume loops |
| POST | /admin/cluster/rebuild | Re-run clustering |
| POST | /admin/item/{type}/{id}/reprocess | Force re-enrichment |
| GET | /clusters/map | Return projection points + minimal metadata |
| POST | /admin/projection/rebuild | Force projection recompute (admin) |
| GET | /admin/models/llm | List available LLM models |
| GET | /admin/models/embeddings | List available embedding models |
| GET | /admin/models/active | Current active models |
| POST | /admin/models/llm/select | Set active LLM (body: {model_id}) |
| POST | /admin/models/embeddings/select | Set active embedding (body: {model_id, force?:bool}) |

Pagination Standard: `page`, `page_size` (default 20, max 100).  
Error Handling: JSON: `{ "error": { "code": string, "message": string, "details"?: any } }`.

## 9. User Stories (Initial Set)
| ID | As a | I want | So that | Acceptance Highlights |
|----|------|--------|---------|-----------------------|
| ST-01 | Research Engineer | See the latest enriched papers | Quickly triage relevance | List shows title, summary, scores, tags |
| ST-02 | Research Engineer | Search papers & repos together | Avoid switching tools | Mixed result list with entity badges |
| ST-03 | Analyst | Input a theory | View supporting & contradicting evidence | Response includes counts + top examples |
| ST-04 | Analyst | Get suggestions when theory sparse | Refine my inquiry | Suggestions show related theory phrases |
| ST-05 | Research Engineer | View similar items for a paper | Explore cluster | Similar list relevance ordered |
| ST-06 | Engineer | Submit repo URL | Enrich & link to related papers | Returns summary, findings, similar set |
| ST-07 | Operator | Pause ingestion | Control resource usage | Status endpoint reflects paused state |
| ST-08 | Operator | Force re-cluster | Update cluster assignments | Job status returned |
| ST-09 | Operator | Reprocess an item | Improve enrichment quality | New timestamp + updated fields |
| ST-10 | Research Engineer | Filter by cluster | Focus exploration | Filter yields subset + cluster metadata |
| ST-11 | Analyst | Inspect rationale for scores | Trust reliability | Rationale present & < 400 chars each |
| ST-12 | Research Engineer | Explore an interactive cluster map | Discover topical neighborhoods | Pan/zoom, hover = tooltip, click opens detail |
| ST-13 | Research Engineer | Lasso-select a region on the map | Narrow analysis to spatial subset | Selection converts to search filter list |
| ST-14 | Operator | Change active LLM model | Optimize cost/quality tradeoff | Model switch validated + version incremented |
| ST-15 | Operator | Change embedding model safely | Upgrade quality | Reject if dimension mismatch unless force with warning |

## 10. Acceptance Criteria Examples (Selected)
Story ST-03 (Theory Query):
- GIVEN a theory string ≥ 10 chars WHEN submitted THEN system returns JSON with `supports[]`, `contradicts[]`, `related_suggestions[]?`.
- Each evidence item includes id, title, summary_snippet, confidence (low/med/high) derived from classification prompt logit deltas.
- If (|supports| + |contradicts|) < 3 THEN related suggestions length ≥ 2.

Story ST-06 (Repo URL Analysis):
Story ST-12 (Cluster Map Interaction):
Story ST-14 (LLM Model Switch):
- GIVEN list of available models WHEN operator selects a new LLM THEN system performs a test completion (health check) AND only on success updates active model & increments `llm_model_version`.  
- WHEN switch completes THEN enrichment pipeline uses new model for subsequent items (existing items remain unchanged) AND audit log entry written.

Story ST-15 (Embedding Model Switch):
- GIVEN current embedding dimension D WHEN operator selects model with dimension D' != D without `force=true` THEN request rejected with informative error.  
- GIVEN `force=true` WHEN accepted THEN system sets new embedding model but flags `reindex_required=true` until manual re-embed job executed (stretch).  
- UI shows warning: "Similarity quality degraded until re-embedding completes".
- GIVEN the cluster map is loaded WHEN the user hovers an item THEN a tooltip shows title + scores within ≤ 50ms (cached client-side).
- GIVEN a dense region WHEN zoomed in THEN point overlap reduces via progressive reveal (LOD) showing individual items.
- GIVEN a lasso selection WHEN completed THEN search view updates filters to those item IDs or derived cluster/tag filters.
- GIVEN valid GitHub repo URL WHEN posted THEN enrichment job runs within 30s queue placement AND detail response includes provisional summary (placeholder if final not ready) with `status: processing|complete`.

## 11. UX & UI Notes
Minimal dark layout; consistent card components for entities. Tag chips, score badges (color scale). Theory mode uses 2-column support vs contradict layout; fallback suggestion panel appears only when evidence sparse. Cluster Map: WebGL or performant Canvas layer; dynamic quad-tree or grid-based binning; tooltips positioned via screen-space transform; lasso overlay (SVG path) capturing projected coordinate bounds. Admin Model Configuration: dual selector panels (LLM + Embedding) with metadata columns (provider, context, cost/1K tokens, dimension for embeddings, last switched timestamp). Confirmation modal appears if projected token cost increase > configured threshold.

## 12. Open Items / To Clarify (Will Refine in v0.2)
- ANN acceleration trigger threshold (10K vs 15K items?).
- Specific heuristics for repo → paper linkage confidence scaling.
- Exact cluster facet labeling (numeric vs generated label via top tags).
- Progressive aggregation strategy for cluster map when item count > 20K (heatmap tile pyramid?).
- Whether to allow temporal slider overlay (deferred) for cluster evolution.
 - Standard cost baseline for warning threshold on model switch (percentage? absolute $?).
 - UI placement for future prompt template editing (same admin page vs separate).

## 13. Risks / Mitigations (Delta vs Brief)
- Re-enrichment churn risk if prompts change frequently → add versioning field `enrichment_version`.
- Theory classification drift → add regression prompt test harness (stretch).
 - Projection recalculation cost grows with corpus → batch + reuse existing coordinates for unchanged items.
 - Model switch could introduce inconsistent scoring across time → track `llm_model_version` & `embedding_model_version` on each item for audit & potential recalibration.

## 14. Release Phasing
Phase 1 (Weeks 1–2): Ingestion + enrichment pipeline + storage + health + basic search.  
Phase 2 (Weeks 3–4): Theory mode, similarity edges, clustering job, URL analysis.  
Phase 3 (Weeks 5–6): UI polish, admin endpoints, instrumentation, hardening for demo.  
Phase 4 (Optional): Stretch (export, improved clustering visualization).

## 15. Handoff to Architecture
On PRD approval: Generate fullstack architecture doc covering: service boundaries, module dependency diagram, concurrency model, data schema detail, embedding & clustering job design, deployment & containerization plan.

---
End of PRD v0.1 (Draft)
