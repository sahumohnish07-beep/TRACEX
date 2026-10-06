# TRACE-X Connection Scoring: Data Cleaning Log

## 1. Profiling Findings & Action Taken

| Identified Issue / Characteristic | Profiling Finding | Decision / Action Taken | Logged Count / Rows Impacted |
| :--- | :--- | :--- | :--- |
| **Missing / Null Values** | 0 nulls across all 16 columns (100% completeness) | No imputation required; dataset is completely populated | 0 rows imputed, 0 rows dropped |
| **Duplicate Records** | 0 exact duplicate rows found in dataset | No deduplication required | 0 rows dropped |
| **Row Count Discrepancy** | File contains exactly 1,048,575 rows ($2^{20}-1$) rather than 3,000,000 | Processed all 1,048,575 available rows in full without truncation | 1,048,575 rows retained |
| **Date Formatting** | `EventDate` is stored as string `DD-MM-YYYY` | Parsed into `datetime` and transformed into structured temporal signals (`event_year`, `event_month`, `event_day_of_week`, `days_since_reference`) | 1,048,575 values converted |
| **High Cardinality ID Columns** | `CaseID`, `EvidenceID`, `PersonName`, `ConnectedPersonName` | Excluded from feature inputs to prevent trivial memorization and ID-leakage | 4 columns excluded |
| **Graph Node Degree Aggregations** | `PersonID`, `ConnectedPersonID`, `LocationID`, `VehicleID` | Replaced raw arbitrary string IDs with frequency / node degree counts | Preserves topological density without ID overfitting |

---

## 2. Leakage Audit

- **`CaseID`**: 1,048,575 distinct values (1 per row). Excluded.
- **`EvidenceID`**: 1,048,575 distinct values. Excluded.
- **`PersonName` / `ConnectedPersonName`**: Excluded.
- **Derived Label Integrity**: The target `is_genuine_connection` is computed deterministically from operational attributes (`CaseStatus`, `Relationship`, `PersonRole`, `Activity`, `EvidenceType`) as defined in `docs/label-derivation.md`. Feature inputs include separate functional encodings while raw score sums are omitted to prevent direct target leakage.
