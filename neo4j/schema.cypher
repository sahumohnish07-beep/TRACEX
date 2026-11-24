// ============================================================================
// TRACE-X Neo4j 5.x Schema: Constraints & Indexes
// Backing Network Analysis (/cases/:id/network) & Missing Link Analysis (/cases/:id/missing-links)
//
// Node Labels (matching Cytoscape node types):
//   :Person      (PERSON - circle)
//   :Phone       (PHONE - rounded-rectangle)
//   :Vehicle     (VEHICLE - diamond)
//   :Location    (LOCATION - tag)
//   :Case        (CASE - rectangle)
//   :CrimeScene  (CRIME_SCENE - octagon)
//
// Relationship Types (matching frontend edge legend):
//   PHONE_COMMUNICATION
//   SHARED_LOCATION
//   SAME_VEHICLE
//   SAME_CRIME_SCENE
//   PREVIOUS_CASE
//   KNOWN_RELATIONSHIP
// ============================================================================

// ----------------------------------------------------------------------------
// 1. UNIQUE CONSTRAINTS (Unique pg_id per label mapping to Postgres UUID/ID)
// ----------------------------------------------------------------------------
CREATE CONSTRAINT person_pg_id_unique IF NOT EXISTS
FOR (p:Person) REQUIRE p.pg_id IS UNIQUE;

CREATE CONSTRAINT phone_pg_id_unique IF NOT EXISTS
FOR (ph:Phone) REQUIRE ph.pg_id IS UNIQUE;

CREATE CONSTRAINT vehicle_pg_id_unique IF NOT EXISTS
FOR (v:Vehicle) REQUIRE v.pg_id IS UNIQUE;

CREATE CONSTRAINT location_pg_id_unique IF NOT EXISTS
FOR (l:Location) REQUIRE l.pg_id IS UNIQUE;

CREATE CONSTRAINT case_pg_id_unique IF NOT EXISTS
FOR (c:Case) REQUIRE c.pg_id IS UNIQUE;

CREATE CONSTRAINT crime_scene_pg_id_unique IF NOT EXISTS
FOR (cs:CrimeScene) REQUIRE cs.pg_id IS UNIQUE;

// ----------------------------------------------------------------------------
// 2. UNIQUE CONSTRAINTS (Unique domain identifier 'id' per label)
// ----------------------------------------------------------------------------
CREATE CONSTRAINT person_id_unique IF NOT EXISTS
FOR (p:Person) REQUIRE p.id IS UNIQUE;

CREATE CONSTRAINT phone_id_unique IF NOT EXISTS
FOR (ph:Phone) REQUIRE ph.id IS UNIQUE;

CREATE CONSTRAINT vehicle_id_unique IF NOT EXISTS
FOR (v:Vehicle) REQUIRE v.id IS UNIQUE;

CREATE CONSTRAINT location_id_unique IF NOT EXISTS
FOR (l:Location) REQUIRE l.id IS UNIQUE;

CREATE CONSTRAINT case_id_unique IF NOT EXISTS
FOR (c:Case) REQUIRE c.id IS UNIQUE;

CREATE CONSTRAINT crime_scene_id_unique IF NOT EXISTS
FOR (cs:CrimeScene) REQUIRE cs.id IS UNIQUE;

// ----------------------------------------------------------------------------
// 3. PROPERTY LOOKUP & FILTER INDEXES
// ----------------------------------------------------------------------------

// Person Indexes
CREATE INDEX person_name_idx IF NOT EXISTS
FOR (p:Person) ON (p.name);

CREATE INDEX person_label_idx IF NOT EXISTS
FOR (p:Person) ON (p.label);

CREATE INDEX person_national_id_idx IF NOT EXISTS
FOR (p:Person) ON (p.national_id);

CREATE INDEX person_status_idx IF NOT EXISTS
FOR (p:Person) ON (p.status);

CREATE INDEX person_source_type_idx IF NOT EXISTS
FOR (p:Person) ON (p.source_type);

// Phone Indexes
CREATE INDEX phone_number_idx IF NOT EXISTS
FOR (ph:Phone) ON (ph.number);

CREATE INDEX phone_subscriber_idx IF NOT EXISTS
FOR (ph:Phone) ON (ph.subscriber);

// Vehicle Indexes
CREATE INDEX vehicle_plate_idx IF NOT EXISTS
FOR (v:Vehicle) ON (v.plate);

CREATE INDEX vehicle_chassis_idx IF NOT EXISTS
FOR (v:Vehicle) ON (v.chassis_number);

// Location Indexes
CREATE INDEX location_name_idx IF NOT EXISTS
FOR (l:Location) ON (l.name);

CREATE INDEX location_city_idx IF NOT EXISTS
FOR (l:Location) ON (l.city);

// Case Indexes
CREATE INDEX case_number_idx IF NOT EXISTS
FOR (c:Case) ON (c.case_number);

CREATE INDEX case_status_idx IF NOT EXISTS
FOR (c:Case) ON (c.status);

CREATE INDEX case_priority_idx IF NOT EXISTS
FOR (c:Case) ON (c.priority);

// CrimeScene Indexes
CREATE INDEX crime_scene_name_idx IF NOT EXISTS
FOR (cs:CrimeScene) ON (cs.name);

CREATE INDEX crime_scene_case_id_idx IF NOT EXISTS
FOR (cs:CrimeScene) ON (cs.case_id);

// ----------------------------------------------------------------------------
// 4. FULLTEXT SEARCH INDEX (Cross-label node search for SearchInput UI)
// ----------------------------------------------------------------------------
CREATE FULLTEXT INDEX tracex_node_search_idx IF NOT EXISTS
FOR (n:Person|Phone|Vehicle|Location|Case|CrimeScene)
ON EACH [n.label, n.name, n.id, n.sublabel, n.number, n.plate, n.case_number, n.address];
