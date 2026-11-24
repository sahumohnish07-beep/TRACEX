"""TRACE-X ML Features: Tier A Feature Vector Builder
Shared deterministic logic for constructing Tier A structural features from raw attributes
or live database / graph records. Matches Phase J and Phase K training schema exactly.
"""

from typing import Dict, Any, Optional
import pandas as pd
import numpy as np
from datetime import datetime

# Domain Mappings consistent with Phase J (ml/data_generation/engineer_features.py)
CASE_TYPES = [
    'Asset Misappropriation', 'Banking Fraud', 'Burglary', 'Cargo Theft',
    'Counterfeit Goods', 'Cyber Fraud', 'Data Theft', 'Document Fraud',
    'Environmental Crime', 'Extortion', 'Financial Fraud', 'Forgery',
    'Fraudulent Procurement', 'Identity Fraud', 'Illegal Mining',
    'Insurance Fraud', 'Online Scam', 'Organized Crime', 'Phishing',
    'Procurement Fraud', 'Property Fraud', 'Smuggling', 'Tax Fraud',
    'Unauthorized Access', 'Vehicle Theft'
]
CASE_TYPE_TO_CODE = {ct: idx for idx, ct in enumerate(CASE_TYPES)}

LOCATIONS = [
    'Ahmedabad', 'Amritsar', 'Aurangabad', 'Bengaluru', 'Bhopal',
    'Bhubaneswar', 'Chandigarh', 'Chennai', 'Coimbatore', 'Dehradun',
    'Delhi', 'Faridabad', 'Ghaziabad', 'Gurugram', 'Guwahati',
    'Hyderabad', 'Indore', 'Jaipur', 'Kanpur', 'Kochi',
    'Kolkata', 'Lucknow', 'Ludhiana', 'Mumbai', 'Nagpur',
    'Nashik', 'Noida', 'Patna', 'Pune', 'Surat'
]
LOCATION_TO_CODE = {loc: idx for idx, loc in enumerate(LOCATIONS)}

FINANCIAL_OR_CYBER_CRIMES = {
    'Banking Fraud', 'Financial Fraud', 'Tax Fraud', 'Cyber Fraud', 'Phishing',
    'Financial Crime / Syndicate Money Laundering', 'Cyber Fraud / Identity Theft'
}
ORGANIZED_CRIME_TYPES = {
    'Organized Crime', 'Smuggling', 'Extortion', 'Illegal Mining',
    'Organized Crime / Smuggling', 'Extortion / Protection Racket'
}

REF_DATE = pd.to_datetime('2021-01-01')

TIER_A_COLUMNS = [
    'case_type_code',
    'is_financial_or_cyber',
    'is_organized_crime',
    'location_code',
    'event_year',
    'event_month',
    'event_day_of_week',
    'days_since_reference',
    'person_degree_freq',
    'connected_degree_freq',
    'location_density_freq',
    'vehicle_reuse_freq',
]

# Baseline training distribution statistics (P75 & medians from 734k train rows)
BASELINE_STATS = {
    'person_degree_p75': 40.0,
    'connected_degree_p75': 40.0,
    'location_density_p75': 187.0,
    'vehicle_reuse_p75': 1.0,
    'days_since_ref_p75': 1566.0,
}


def build_tier_a_vector(
    case_type: Optional[str] = None,
    location: Optional[str] = None,
    event_date: Optional[Any] = None,
    person_degree: int = 1,
    connected_degree: int = 1,
    location_density: int = 1,
    vehicle_reuse: int = 1,
) -> pd.DataFrame:
    """Constructs a 1-row DataFrame containing the exact 12 Tier A features

    for inference with preprocessor_tier_a and isolation_forest.
    """
    # 1. Case context
    case_type_code = CASE_TYPE_TO_CODE.get(case_type, -1) if case_type else -1
    is_financial = 1 if (case_type and (case_type in FINANCIAL_OR_CYBER_CRIMES or any(fc.lower() in case_type.lower() for fc in ['fraud', 'cyber', 'financial', 'tax']))) else 0
    is_organized = 1 if (case_type and (case_type in ORGANIZED_CRIME_TYPES or any(oc.lower() in case_type.lower() for oc in ['organized', 'smuggling', 'extortion', 'syndicate']))) else 0

    # 2. Location
    loc_clean = location.strip() if location else ""
    loc_code = -1
    for loc_name, code in LOCATION_TO_CODE.items():
        if loc_name.lower() in loc_clean.lower():
            loc_code = code
            break

    # 3. Temporal
    if event_date is None:
        dt = datetime.now()
    elif isinstance(event_date, str):
        try:
            dt = pd.to_datetime(event_date, format='%d-%m-%Y')
        except Exception:
            try:
                dt = pd.to_datetime(event_date)
            except Exception:
                dt = datetime.now()
    elif hasattr(event_date, "year"):
        dt = event_date
    else:
        dt = datetime.now()

    dt_ts = pd.to_datetime(dt)
    event_year = dt_ts.year if hasattr(dt_ts, 'year') else 2026
    event_month = dt_ts.month if hasattr(dt_ts, 'month') else 2
    event_day_of_week = dt_ts.dayofweek if hasattr(dt_ts, 'dayofweek') else 0
    try:
        days_since_ref = (dt_ts - REF_DATE).days
    except Exception:
        days_since_ref = 1500

    row = {
        'case_type_code': np.int8(case_type_code),
        'is_financial_or_cyber': np.int8(is_financial),
        'is_organized_crime': np.int8(is_organized),
        'location_code': np.int8(loc_code),
        'event_year': np.int16(event_year),
        'event_month': np.int8(event_month),
        'event_day_of_week': np.int8(event_day_of_week),
        'days_since_reference': np.int16(days_since_ref),
        'person_degree_freq': np.int32(person_degree),
        'connected_degree_freq': np.int32(connected_degree),
        'location_density_freq': np.int32(location_density),
        'vehicle_reuse_freq': np.int8(vehicle_reuse),
    }

    return pd.DataFrame([row], columns=TIER_A_COLUMNS)
