import logging
from typing import Optional
from neo4j import AsyncGraphDatabase, AsyncDriver
from app.core.config import settings

logger = logging.getLogger("tracex_graph_driver")

_async_driver: Optional[AsyncDriver] = None


def get_graph_driver() -> AsyncDriver:
    global _async_driver
    if _async_driver is None:
        _async_driver = AsyncGraphDatabase.driver(
            settings.NEO4J_URI,
            auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD),
            max_connection_pool_size=50,
            connection_acquisition_timeout=30.0,
        )
    return _async_driver


async def close_graph_driver():
    global _async_driver
    if _async_driver is not None:
        await _async_driver.close()
        _async_driver = None
        logger.info("Neo4j async graph driver closed.")
