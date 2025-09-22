"""In-memory model configuration service (placeholder).

Provides:
 - list_llm_models / list_embedding_models
 - get_active / select_llm / select_embedding
 - version counters & reindex_required flag
"""
from __future__ import annotations
from typing import Optional
from pydantic import BaseModel

class LLMModel(BaseModel):
    id: str
    provider: str
    context: int
    cost_input: float
    cost_output: float

    model_config = {"protected_namespaces": ()}

class EmbeddingModel(BaseModel):
    id: str
    provider: str
    dimension: int
    cost: float

    model_config = {"protected_namespaces": ()}

class ActiveModels(BaseModel):
    llm_id: str
    llm_version: int
    embedding_id: str
    embedding_version: int
    reindex_required: bool = False

    model_config = {"protected_namespaces": ()}

_LLM_MODELS = [
    LLMModel(id="gpt-4.1-mini", provider="openai", context=128000, cost_input=0.003, cost_output=0.006),
    LLMModel(id="gpt-4o", provider="openai", context=128000, cost_input=0.005, cost_output=0.015),
]
_EMBED_MODELS = [
    EmbeddingModel(id="text-embedding-3-large", provider="openai", dimension=3072, cost=0.00013),
    EmbeddingModel(id="text-embedding-3-small", provider="openai", dimension=1536, cost=0.00002),
]

_active = ActiveModels(
    llm_id=_LLM_MODELS[0].id,
    llm_version=1,
    embedding_id=_EMBED_MODELS[0].id,
    embedding_version=1,
)

def list_llm_models() -> list[LLMModel]:
    return _LLM_MODELS

def list_embedding_models() -> list[EmbeddingModel]:
    return _EMBED_MODELS

def get_llm(model_id: str) -> Optional[LLMModel]:
    return next((m for m in _LLM_MODELS if m.id == model_id), None)

def get_embedding(model_id: str) -> Optional[EmbeddingModel]:
    return next((m for m in _EMBED_MODELS if m.id == model_id), None)

def get_active() -> ActiveModels:
    return _active

def select_llm(model_id: str) -> ActiveModels:
    model = get_llm(model_id)
    if not model:
        raise ValueError("unknown llm model")
    global _active  # noqa: PLW0603
    _active.llm_id = model.id
    _active.llm_version += 1
    return _active

def select_embedding(model_id: str, force: bool = False) -> ActiveModels:
    model = get_embedding(model_id)
    if not model:
        raise ValueError("unknown embedding model")
    global _active  # noqa: PLW0603
    # Dimension mismatch simulation: if dimension != current active model dimension
    current_dim = get_embedding(_active.embedding_id).dimension  # type: ignore[arg-type]
    if model.dimension != current_dim and not force:
        raise DimensionMismatchError(current=current_dim, new=model.dimension)
    _active.embedding_id = model.id
    _active.embedding_version += 1
    if model.dimension != current_dim:
        _active.reindex_required = True
    return _active

class DimensionMismatchError(Exception):
    def __init__(self, current: int, new: int):  # noqa: D401
        self.current = current
        self.new = new
        super().__init__(f"dimension mismatch current={current} new={new}")
