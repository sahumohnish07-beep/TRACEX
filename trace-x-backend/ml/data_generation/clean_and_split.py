"""TRACE-X Data Generation: Clean, Transform & Stratified Split
Implements Steps 3 & 4:
1. Computes global frequency lookups chunk-by-chunk to prevent memory spikes.
2. Engineers features and builds weak label for each candidate connection record.
3. Performs stratified train/val/test split (70 / 15 / 15) on target `is_genuine_connection`.
4. Saves output as ml/data/splits/{train,val,test}.parquet.
"""

import os
import sys
import time
from collections import Counter
import pandas as pd
import numpy as np

# Ensure local imports work
sys.path.insert(0, os.path.dirname(__file__))
from build_label import compute_weak_label
from engineer_features import engineer_features


def run_pipeline():
    raw_path = os.path.join(os.path.dirname(__file__), "..", "data", "raw", "TraceX_3Million_Unique_Cases.csv")
    splits_dir = os.path.join(os.path.dirname(__file__), "..", "data", "splits")
    os.makedirs(splits_dir, exist_ok=True)

    print("=================================================================")
    print("           TRACE-X ML DATA CLEANING & SPLIT PIPELINE             ")
    print("=================================================================")
    print(f"Reading raw dataset: {raw_path}")

    # Pass 1: Build frequency maps chunk-by-chunk
    print("\n--- Pass 1: Building global node degree & entity frequencies ---")
    t0 = time.time()
    person_counts = Counter()
    connected_counts = Counter()
    loc_counts = Counter()
    veh_counts = Counter()
    total_raw_rows = 0

    chunk_size = 200_000
    for chunk in pd.read_csv(
        raw_path,
        chunksize=chunk_size,
        usecols=['PersonID', 'ConnectedPersonID', 'LocationID', 'VehicleID'],
    ):
        total_raw_rows += len(chunk)
        person_counts.update(chunk['PersonID'])
        connected_counts.update(chunk['ConnectedPersonID'])
        loc_counts.update(chunk['LocationID'])
        veh_counts.update(chunk['VehicleID'])
        print(f"  Processed {total_raw_rows:,} rows for entity frequencies...", end="\r")

    t1 = time.time()
    print(f"\nPass 1 complete: {total_raw_rows:,} rows processed in {t1 - t0:.2f}s.")
    print(f"  Distinct PersonIDs: {len(person_counts):,}")
    print(f"  Distinct ConnectedPersonIDs: {len(connected_counts):,}")
    print(f"  Distinct LocationIDs: {len(loc_counts):,}")
    print(f"  Distinct VehicleIDs: {len(veh_counts):,}")

    # Pass 2: Engineer features and assign weak label
    print("\n--- Pass 2: Feature Engineering & Weak Labeling ---")
    t2 = time.time()
    processed_chunks = []
    
    for chunk_idx, raw_chunk in enumerate(pd.read_csv(raw_path, chunksize=chunk_size)):
        # Engineer features
        feat_df = engineer_features(
            df=raw_chunk,
            person_freq_map=person_counts,
            connected_freq_map=connected_counts,
            loc_freq_map=loc_counts,
            veh_freq_map=veh_counts,
        )
        # Compute label
        feat_df['is_genuine_connection'] = compute_weak_label(raw_chunk)
        processed_chunks.append(feat_df)
        print(f"  Transformed chunk {chunk_idx + 1} ({len(feat_df):,} rows)...", end="\r")

    full_feature_table = pd.concat(processed_chunks, ignore_index=True)
    t3 = time.time()
    print(f"\nPass 2 complete: Engineered table shape {full_feature_table.shape} in {t3 - t2:.2f}s.")

    # Target class balance
    target_counts = full_feature_table['is_genuine_connection'].value_counts()
    pos_rate = full_feature_table['is_genuine_connection'].mean()
    print(f"\nTarget Class Distribution:")
    print(f"  Negative (0): {target_counts.get(0, 0):,} ({1 - pos_rate:.2%})")
    print(f"  Positive (1): {target_counts.get(1, 0):,} ({pos_rate:.2%})")

    # Pass 3: Stratified train / val / test split (70 / 15 / 15)
    print("\n--- Pass 3: Stratified Splitting (70% Train, 15% Val, 15% Test) ---")
    np.random.seed(42)

    # Group by label to stratify
    idx_0 = full_feature_table[full_feature_table['is_genuine_connection'] == 0].index.to_numpy().copy()
    idx_1 = full_feature_table[full_feature_table['is_genuine_connection'] == 1].index.to_numpy().copy()
    np.random.shuffle(idx_0)
    np.random.shuffle(idx_1)


    def split_indices(indices):
        n = len(indices)
        n_train = int(n * 0.70)
        n_val = int(n * 0.15)
        train_idx = indices[:n_train]
        val_idx = indices[n_train:n_train + n_val]
        test_idx = indices[n_train + n_val:]
        return train_idx, val_idx, test_idx

    tr0, val0, te0 = split_indices(idx_0)
    tr1, val1, te1 = split_indices(idx_1)

    train_indices = np.concatenate([tr0, tr1])
    val_indices = np.concatenate([val0, val1])
    test_indices = np.concatenate([te0, te1])

    np.random.shuffle(train_indices)
    np.random.shuffle(val_indices)
    np.random.shuffle(test_indices)

    train_df = full_feature_table.iloc[train_indices].copy()
    val_df = full_feature_table.iloc[val_indices].copy()
    test_df = full_feature_table.iloc[test_indices].copy()

    print(f"  Train shape: {train_df.shape} (Positive rate: {train_df['is_genuine_connection'].mean():.2%})")
    print(f"  Val shape:   {val_df.shape} (Positive rate: {val_df['is_genuine_connection'].mean():.2%})")
    print(f"  Test shape:  {test_df.shape} (Positive rate: {test_df['is_genuine_connection'].mean():.2%})")

    # Save to Parquet
    train_path = os.path.join(splits_dir, "train.parquet")
    val_path = os.path.join(splits_dir, "val.parquet")
    test_path = os.path.join(splits_dir, "test.parquet")

    print(f"\nWriting Parquet splits to {splits_dir}...")
    train_df.to_parquet(train_path, index=False, engine="pyarrow")
    val_df.to_parquet(val_path, index=False, engine="pyarrow")
    test_df.to_parquet(test_path, index=False, engine="pyarrow")

    print(f"  Saved {train_path} ({os.path.getsize(train_path) / (1024*1024):.2f} MB)")
    print(f"  Saved {val_path} ({os.path.getsize(val_path) / (1024*1024):.2f} MB)")
    print(f"  Saved {test_path} ({os.path.getsize(test_path) / (1024*1024):.2f} MB)")
    print("\nPipeline execution successfully finished.")


if __name__ == "__main__":
    run_pipeline()
