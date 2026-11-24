"""TRACE-X Data Generation: Engineer Features
Implements Step 2: Transforms confirmed raw columns into numeric / categorical ML features.
"""

import pandas as pd
import numpy as np
from datetime import datetime
from typing import Dict, Any

# Fixed category orderings for deterministic encoding
RELATIONSHIPS = [
    'associated_with', 'contacted', 'financially_connected', 'knows',
    'linked_to_entity', 'linked_to_vehicle', 'reported_by', 'visited_location',
    'witnessed', 'worked_with'
]
REL_TO_CODE = {r: idx for idx, r in enumerate(RELATIONSHIPS)}

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

CASE_STATUSES = [
    'Charges Filed', 'Closed', 'Court Pending', 'Registered',
    'Resolved', 'Under Investigation', 'Under Review'
]
STATUS_TO_CODE = {cs: idx for idx, cs in enumerate(CASE_STATUSES)}

PERSON_ROLES = [
    'Associate', 'Complainant', 'Contractor', 'Driver', 'Employee',
    'Officer', 'Owner', 'Person of Interest', 'Victim', 'Witness'
]
ROLE_TO_CODE = {pr: idx for idx, pr in enumerate(PERSON_ROLES)}

ACTIVITIES = [
    'Asset linked', 'Case review completed', 'Communication logged',
    'Document submitted', 'Evidence registered', 'Location visit recorded',
    'Reported incident', 'Transaction recorded', 'Vehicle observed',
    'Witness statement recorded'
]
ACTIVITY_TO_CODE = {ac: idx for idx, ac in enumerate(ACTIVITIES)}

EVIDENCE_TYPES = [
    'Audit Record', 'CCTV Reference', 'Call Metadata', 'Digital Record',
    'Document', 'Location Record', 'Photograph Reference',
    'Transaction Record', 'Vehicle Record', 'Witness Statement'
]
EVIDENCE_TYPE_TO_CODE = {et: idx for idx, et in enumerate(EVIDENCE_TYPES)}

LOCATIONS = [
    'Ahmedabad', 'Amritsar', 'Aurangabad', 'Bengaluru', 'Bhopal',
    'Bhubaneswar', 'Chandigarh', 'Chennai', 'Coimbatore', 'Dehradun',
    'Delhi', 'Faridabad', 'Ghaziabad', 'Gurugram', 'Guwahati',
    'Hyderabad', 'Indore', 'Jaipur', 'Kanpur', 'Kochi',
    'Kolkata', 'Lucknow', 'Ludhiana', 'Mumbai', 'Nagpur',
    'Nashik', 'Noida', 'Patna', 'Pune', 'Surat'
]
LOCATION_TO_CODE = {loc: idx for idx, loc in enumerate(LOCATIONS)}

# Domain groupings
HIGH_INTIMACY_RELATIONSHIPS = {'financially_connected', 'worked_with', 'associated_with', 'knows'}
FINANCIAL_OR_CYBER_CRIMES = {'Banking Fraud', 'Financial Fraud', 'Tax Fraud', 'Cyber Fraud', 'Phishing'}
ORGANIZED_CRIME_TYPES = {'Organized Crime', 'Smuggling', 'Extortion', 'Illegal Mining'}
ADJUDICATED_STATUSES = {'Resolved', 'Closed', 'Charges Filed'}
SUSPECT_ROLES = {'Person of Interest', 'Associate', 'Owner', 'Driver'}
WITNESS_VICTIM_ROLES = {'Witness', 'Victim', 'Complainant'}
HARD_TELEMETRY_ACTIVITIES = {'Transaction recorded', 'Communication logged', 'Asset linked'}
FORENSIC_EVIDENCE_TYPES = {'Audit Record', 'Transaction Record', 'Call Metadata'}

REF_DATE = pd.to_datetime('2021-01-01')


def engineer_features(
    df: pd.DataFrame,
    person_freq_map: Dict[str, int],
    connected_freq_map: Dict[str, int],
    loc_freq_map: Dict[str, int],
    veh_freq_map: Dict[str, int],
) -> pd.DataFrame:
    """Transforms raw DataFrame chunk into model feature matrix."""
    feats = pd.DataFrame(index=df.index)

    # 1. Relationship features
    feats['rel_type_code'] = df['Relationship'].map(REL_TO_CODE).fillna(-1).astype(np.int8)
    feats['is_high_intimacy_rel'] = df['Relationship'].isin(HIGH_INTIMACY_RELATIONSHIPS).astype(np.int8)
    feats['is_vehicle_link'] = (df['Relationship'] == 'linked_to_vehicle').astype(np.int8)
    feats['is_location_visit'] = (df['Relationship'] == 'visited_location').astype(np.int8)
    feats['is_witness_reported'] = df['Relationship'].isin({'witnessed', 'reported_by'}).astype(np.int8)

    # 2. Case context features
    feats['case_type_code'] = df['CaseType'].map(CASE_TYPE_TO_CODE).fillna(-1).astype(np.int8)
    feats['is_financial_or_cyber'] = df['CaseType'].isin(FINANCIAL_OR_CYBER_CRIMES).astype(np.int8)
    feats['is_organized_crime'] = df['CaseType'].isin(ORGANIZED_CRIME_TYPES).astype(np.int8)
    feats['case_status_code'] = df['CaseStatus'].map(STATUS_TO_CODE).fillna(-1).astype(np.int8)
    feats['is_case_adjudicated'] = df['CaseStatus'].isin(ADJUDICATED_STATUSES).astype(np.int8)

    # 3. Person role features
    feats['person_role_code'] = df['PersonRole'].map(ROLE_TO_CODE).fillna(-1).astype(np.int8)
    feats['is_suspect_role'] = df['PersonRole'].isin(SUSPECT_ROLES).astype(np.int8)
    feats['is_witness_or_victim'] = df['PersonRole'].isin(WITNESS_VICTIM_ROLES).astype(np.int8)

    # 4. Activity & Evidence features
    feats['activity_code'] = df['Activity'].map(ACTIVITY_TO_CODE).fillna(-1).astype(np.int8)
    feats['is_hard_telemetry_act'] = df['Activity'].isin(HARD_TELEMETRY_ACTIVITIES).astype(np.int8)
    feats['evidence_type_code'] = df['EvidenceType'].map(EVIDENCE_TYPE_TO_CODE).fillna(-1).astype(np.int8)
    feats['is_forensic_evidence'] = df['EvidenceType'].isin(FORENSIC_EVIDENCE_TYPES).astype(np.int8)

    # 5. Location features
    feats['location_code'] = df['Location'].map(LOCATION_TO_CODE).fillna(-1).astype(np.int8)

    # 6. Temporal features
    dt = pd.to_datetime(df['EventDate'], format='%d-%m-%Y', errors='coerce')
    feats['event_year'] = dt.dt.year.fillna(2023).astype(np.int16)
    feats['event_month'] = dt.dt.month.fillna(6).astype(np.int8)
    feats['event_day_of_week'] = dt.dt.dayofweek.fillna(0).astype(np.int8)
    feats['days_since_reference'] = (dt - REF_DATE).dt.days.fillna(365).astype(np.int16)

    # 7. Graph node degree & frequency features
    feats['person_degree_freq'] = df['PersonID'].map(person_freq_map).fillna(1).astype(np.int32)
    feats['connected_degree_freq'] = df['ConnectedPersonID'].map(connected_freq_map).fillna(1).astype(np.int32)
    feats['location_density_freq'] = df['LocationID'].map(loc_freq_map).fillna(1).astype(np.int32)
    feats['vehicle_reuse_freq'] = df['VehicleID'].map(veh_freq_map).fillna(1).astype(np.int8)

    return feats
