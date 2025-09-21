"""Ingestion scheduler stub.

Will later:
 - Maintain async loops (papers every 30m, repos every 2h)
 - Enqueue items into enrichment queue
 - Support pause/resume via shared state flag
"""
import asyncio
from typing import Callable, Awaitable

class IngestionController:
    def __init__(self):
        self.paused = False
        self._tasks: list[asyncio.Task] = []

    def pause(self):
        self.paused = True

    def resume(self):
        self.paused = False

    def spawn_loop(self, name: str, interval_sec: int, func: Callable[[], Awaitable[None]]):
        async def _loop():
            while True:
                if not self.paused:
                    try:
                        await func()
                    except Exception:  # noqa: BLE001
                        # TODO: structured logging once logger available
                        pass
                await asyncio.sleep(interval_sec)
        self._tasks.append(asyncio.create_task(_loop(), name=name))

controller = IngestionController()
