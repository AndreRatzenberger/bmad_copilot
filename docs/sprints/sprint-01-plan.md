---
title: Sprint 01 Plan
span: 10 days
as_of: 2025-09-22
objective: "Establish core query & detail experience with minimal backend surface and integrate real data layer scaffolding"
---

# Sprint 01 – Sharded Architecture & Story Subset

## 1. Sprint Goal
Deliver the first end‑to‑end vertical slice: basic unified search + item detail with similar items, plus foundation for theory queries (stub) and URL analyze (job stub). Provide model listing read-only to prepare for later model switch flows.

## 2. Included PRD Stories (Scoped Versions)
| Story | Original Status | Sprint 01 Scope | Target Status End Sprint |
|-------|-----------------|-----------------|--------------------------|
| ST-02 Unified Search | partial | Implement real GET /search (q, types[], page, page_size). Basic ranking (cosine only). Mock tag & cluster facets (empty arrays ok). | partial→baseline-done |
| ST-05 Similar Items For Paper | missing | Implement GET /item/{id} returning metadata + similar[] (≥5 or fewer if low corpus). UI detail page. | missing→baseline-done |
| ST-03 Theory Evidence Classification | scaffold | POST /theory/query returns deterministic mock supports/contradicts. UI submit + render columns (no LLM yet). | scaffold→partial |
| ST-06 Repo URL Analysis | scaffold | POST /analyze/url returns job_id; GET /analyze/status/{job_id} cycles through states with synthetic delay. UI polling + completion placeholder card. | scaffold→partial |
| ST-14 Change Active LLM Model | missing | Read-only GET /admin/models (llm) & active model. No select yet. | missing→placeholder |

### Deferred / Explicitly Out of Scope
| Story | Deferral Reason |
|-------|-----------------|
| ST-01 Latest Enriched Papers | Depends on ingestion realism; search covers list needs for now. |
| ST-10 Filter By Cluster | Requires cluster metadata pipeline; stub later. |
| ST-11 Score Rationale Visibility | Needs enrichment rationale fields. |
| ST-12 / ST-13 Cluster Map & Lasso | Larger effort; next sprint foundation. |
| ST-15 Embedding Model Switch | Requires model select & dimension logic; later sprint. |
| ST-07 / ST-08 / ST-09 Admin control actions | Focus kept narrow for first integration slice. |

## 3. Backend Deliverables
| Endpoint | Method | Sprint 01 Contract (JSON shape abbreviated) |
|----------|--------|--------------------------------------------|
| /search | GET | { page, page_size, total, results:[{id,type,title,summary,tags,scores:{relevance,interesting},cluster_id?}], timings:{query_ms} } |
| /item/{id} | GET | { id,type,title,summary,tags,scores:{relevance,interesting,rationale? null}, similar:[{id,type,title,scores:{relevance}}] } |
| /theory/query | POST | { theory, supports:[{id,title,confidence,snippet}], contradicts:[...], related_suggestions:[...] } (mock static) |
| /analyze/url | POST | { job_id } |
| /analyze/status/{job_id} | GET | { job_id, state: idle|queued|enriching|complete|error, item_id? } |
| /admin/models/llm | GET | { active:{id,version}, candidates:[{id,cost_per_1k:{input,output}}] } |

Non-functional:
1. Response time (search) median dev: < 400ms on 1K mock items.
2. Deterministic mock data generation (seed) for test repeatability.
3. Consistent error envelope: { "error": { "code": "NOT_FOUND", "message": "..." } }.

## 4. Frontend Deliverables
| Feature | Deliverables |
|---------|--------------|
| React Query Integration | QueryClient provider, apiClient wrapper with base URL + error normalization, hooks: useSearch, useItem, useTheoryQuery, useUrlAnalyze(jobId), useLlmModels. |
| Search Page | Replace mock list with live query (debounced 300ms). Basic pagination (next/prev). Loading skeleton & empty state. |
| Item Detail Page | New route `/item/[id]` with title, summary, tags, score badges (simple style), similar items list (links). |
| Similar Items Cards | Minimal inline list (title + relevance). Fallback message if < 3. |
| Theory Explorer | Submit form (>=10 chars), show two columns with mock evidence, sparse suggestions if total <3. Loading state. |
| URL Analyze | Form submit -> job_id; poll (2s interval) until complete; show placeholder card with item link (when complete). Error & timeout (≥30s). |
| LLM Model Listing | Admin page section: active model + table of candidates (read-only). |
| Testing | Add component test for search hook (mock fetch), theory mock query snapshot, URL analyze polling logic. |
| Accessibility | Focus management after navigation to item detail; aria-label on relevance scores; theory columns landmark role="region" aria-label="Supporting Evidence" / "Contradicting Evidence". |

## 5. Sprint Acceptance Criteria
1. Manual walkthrough: search -> open item detail -> navigate via similar item link works.
2. Theory query of length ≥10 returns mock supports & contradicts rendered in columns.
3. URL analyze displays progress states (queued then enriching then complete) with synthetic timing.
4. Admin LLM models list renders active model distinct (bold or badge).
5. All new endpoints covered by minimal unit or integration tests (search ranking function, item similar selection, url analyze state machine).
6. No unhandled promise rejections in browser console during typical flows.
7. Lighthouse (local) accessibility score ≥ 80 for search & item detail routes (informational; not hard fail if minor contrast issues).

## 6. Definition of Done (Sprint Level)
- Code merged to main / stable branch.
- Updated docs: story statuses adjusted (frontend_status transitions captured).
- `ui-implementation-status.md` updated (automated or manual) marking improved statuses.
- Basic test suite green (include new tests).
- Architecture section 21/22 require no changes OR delta documented if deviations.

## 7. Data & Mock Strategy
Generate deterministic mock corpus (e.g., 200 items) on startup if TinyDB empty:
- ID scheme: p_{hex} or r_{hex}
- Random tags from fixed pool; embeddings optionally mocked (vectors not required sprint 01 if similarity precomputed mock mapping prepared).
Similar items (sprint 01): Precompute top 5 by simple tag overlap + random tiebreak at startup; store in adjacency map.

## 8. Risks & Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| Scope creep (adding cluster map) | Delays slice completion | Explicitly deferred; enforce WIP limit |
| Over-engineering ranking early | Lost time | Use cosine-only now; plug composite later |
| Polling inefficiency for analyze | Browser noise | Simple interval + clear on completion; upgrade to SSE later |
| Theory endpoint future async shift | Refactor churn | Abstract hook to accept either immediate or job-based result |

## 9. Stretch Goals (If Slack)
- Add basic facet counts (mock) to /search.
- Implement score rationale placeholder field in /item.
- Add model switch POST (happy path only, no cost/dimension logic).

## 10. Test Plan (Sprint Scope)
| Test Type | Cases |
|-----------|-------|
| Unit | similarity selection logic; search ranking; url analyze state reducer; theory mock parser |
| Integration (API) | /search pagination; /item 404; /analyze lifecycle (queued→complete) |
| Component | Search page renders results & empty state; Item detail similar list fallback |
| E2E (light) | Search -> open first item -> navigate similar -> back navigation preserved query |

## 11. Ownership & Roles
| Area | Owner |
|------|-------|
| Backend endpoints | Backend dev A |
| Frontend integration | Frontend dev B |
| Tests & CI wiring | Dev B (frontend) / Dev A (API) |
| PO validation | PO |

## 12. Update Protocol
Maintain a running CHANGELOG section in this file during sprint with dated entries for scope adjustments.

### CHANGELOG
- 2025-09-22: Initial sprint shard created.

---
End Sprint 01 Plan
