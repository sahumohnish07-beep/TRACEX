from celery import Celery
from celery.schedules import crontab
from app.core.config import settings

celery_app = Celery(
    "tracex_worker",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=["app.tasks"],
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    beat_schedule={
        # Outbox poller runs every 10 seconds to sync confirmed entities to Neo4j
        "poll-graph-sync-outbox-every-10s": {
            "task": "app.tasks.sync_confirmed_entity_to_graph",
            "schedule": 10.0,
        },
        # Expire shared records hourly
        "expire-shared-records-hourly": {
            "task": "app.tasks.expire_shared_records",
            "schedule": crontab(minute=0),  # Top of every hour
        },
    },
)

