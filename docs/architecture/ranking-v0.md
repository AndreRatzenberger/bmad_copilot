# Initial Ranking Strategy (v0)

For the MVP initial implementation, ranking will use ONLY cosine similarity over embeddings (once available). Until embeddings exist, results will appear in insertion order.

Future planned composite (from architecture doc) will add weighted components:
`0.55*cosine + 0.20*tag_jaccard + 0.15*recency_decay + 0.10*interesting_norm`

Rationale: deliver search quickly; avoid premature optimization.

Migration path: introduce additional features incrementally, verifying each factor's impact via offline evaluation scripts.
