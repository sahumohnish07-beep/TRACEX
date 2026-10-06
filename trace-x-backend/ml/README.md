# TRACE-X Machine Learning Engine

This directory contains offline & online graph intelligence pipelines:

- `pipelines/entity_resolution.py`: Deduplication and cross-case entity resolution (fuzzy matching, CDR overlap, identifier phonetic matching).
- `pipelines/link_prediction.py`: Graph neural network & heuristic missing link prediction models.
- `artifacts/`: Serialized model weights, embeddings, and feature scalers.
