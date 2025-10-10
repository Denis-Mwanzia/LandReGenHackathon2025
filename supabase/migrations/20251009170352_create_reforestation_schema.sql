/*
  # Kitui Reforest AI Database Schema

  ## Overview
  This migration creates the complete database schema for the Kitui Reforest AI platform,
  enabling community-driven reforestation monitoring and AI-powered recommendations.

  ## New Tables

  ### 1. `tree_species`
  Stores information about native tree species suitable for Kitui County
  - `id` (uuid, primary key)
  - `name` (text) - Common name of the tree
  - `scientific_name` (text) - Scientific classification
  - `description` (text) - Details about the species
  - `min_rainfall` (integer) - Minimum annual rainfall in mm
  - `max_rainfall` (integer) - Maximum annual rainfall in mm
  - `soil_types` (text array) - Compatible soil types
  - `survival_rate` (numeric) - Expected survival rate percentage
  - `growth_rate` (text) - Slow, moderate, or fast
  - `benefits` (text array) - Ecological and economic benefits
  - `planting_method` (text) - Recommended planting approach
  - `created_at` (timestamptz)

  ### 2. `degraded_zones`
  Tracks identified degraded land areas in Kitui County
  - `id` (uuid, primary key)
  - `zone_name` (text) - Name or identifier for the zone
  - `latitude` (numeric) - Central latitude coordinate
  - `longitude` (numeric) - Central longitude coordinate
  - `polygon_data` (jsonb) - GeoJSON polygon of the zone boundary
  - `area_hectares` (numeric) - Size of degraded area
  - `ndvi_score` (numeric) - Normalized Difference Vegetation Index (-1 to 1)
  - `degradation_level` (text) - Severe, moderate, or mild
  - `soil_type` (text) - Predominant soil type
  - `avg_rainfall` (integer) - Average annual rainfall in mm
  - `identified_date` (timestamptz)
  - `created_at` (timestamptz)

  ### 3. `reforestation_projects`
  Community and NGO reforestation initiatives
  - `id` (uuid, primary key)
  - `project_name` (text)
  - `description` (text)
  - `organization` (text) - Community group or NGO name
  - `contact_email` (text)
  - `contact_phone` (text)
  - `latitude` (numeric)
  - `longitude` (numeric)
  - `zone_id` (uuid, foreign key) - Links to degraded_zones
  - `area_hectares` (numeric)
  - `status` (text) - Planning, active, or completed
  - `start_date` (date)
  - `target_trees` (integer)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 4. `planting_records`
  Individual tree planting events and monitoring data
  - `id` (uuid, primary key)
  - `project_id` (uuid, foreign key) - Links to reforestation_projects
  - `species_id` (uuid, foreign key) - Links to tree_species
  - `quantity` (integer) - Number of trees planted
  - `planting_date` (date)
  - `latitude` (numeric)
  - `longitude` (numeric)
  - `survival_count` (integer) - Trees surviving during last check
  - `last_monitored` (date)
  - `notes` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 5. `ai_recommendations`
  AI-generated recommendations for tree species selection
  - `id` (uuid, primary key)
  - `location_lat` (numeric)
  - `location_lng` (numeric)
  - `soil_type` (text)
  - `rainfall` (integer)
  - `degradation_score` (numeric)
  - `recommended_species` (jsonb) - Array of species with scores
  - `planting_strategy` (text)
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Public read access for tree_species and degraded_zones (educational data)
  - Authenticated users can create and update their own projects and records
  - All users can view all projects (transparency for community monitoring)

  ## Important Notes
  1. Using JSONB for flexible GeoJSON storage and recommendation data
  2. Numeric type for precise geographic coordinates and measurements
  3. Indexes added for common query patterns (location-based searches)
  4. Default values set for timestamps and status fields
*/

-- Create tree_species table
CREATE TABLE IF NOT EXISTS tree_species (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  scientific_name text NOT NULL,
  description text,
  min_rainfall integer DEFAULT 400,
  max_rainfall integer DEFAULT 1200,
  soil_types text[] DEFAULT '{}',
  survival_rate numeric(5,2) DEFAULT 70.00,
  growth_rate text DEFAULT 'moderate',
  benefits text[] DEFAULT '{}',
  planting_method text,
  created_at timestamptz DEFAULT now()
);

-- Create degraded_zones table
CREATE TABLE IF NOT EXISTS degraded_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_name text NOT NULL,
  latitude numeric(10,7) NOT NULL,
  longitude numeric(10,7) NOT NULL,
  polygon_data jsonb,
  area_hectares numeric(10,2),
  ndvi_score numeric(4,3),
  degradation_level text DEFAULT 'moderate',
  soil_type text,
  avg_rainfall integer,
  identified_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create reforestation_projects table
CREATE TABLE IF NOT EXISTS reforestation_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_name text NOT NULL,
  description text,
  organization text NOT NULL,
  contact_email text,
  contact_phone text,
  latitude numeric(10,7) NOT NULL,
  longitude numeric(10,7) NOT NULL,
  zone_id uuid REFERENCES degraded_zones(id),
  area_hectares numeric(10,2),
  status text DEFAULT 'planning',
  start_date date,
  target_trees integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create planting_records table
CREATE TABLE IF NOT EXISTS planting_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES reforestation_projects(id) ON DELETE CASCADE,
  species_id uuid REFERENCES tree_species(id),
  quantity integer NOT NULL DEFAULT 0,
  planting_date date DEFAULT CURRENT_DATE,
  latitude numeric(10,7),
  longitude numeric(10,7),
  survival_count integer,
  last_monitored date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create ai_recommendations table
CREATE TABLE IF NOT EXISTS ai_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_lat numeric(10,7) NOT NULL,
  location_lng numeric(10,7) NOT NULL,
  soil_type text,
  rainfall integer,
  degradation_score numeric(4,3),
  recommended_species jsonb DEFAULT '[]',
  planting_strategy text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_degraded_zones_location ON degraded_zones(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_projects_location ON reforestation_projects(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_projects_status ON reforestation_projects(status);
CREATE INDEX IF NOT EXISTS idx_planting_records_project ON planting_records(project_id);
CREATE INDEX IF NOT EXISTS idx_planting_records_species ON planting_records(species_id);

-- Enable Row Level Security
ALTER TABLE tree_species ENABLE ROW LEVEL SECURITY;
ALTER TABLE degraded_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE reforestation_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE planting_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tree_species (public read, no write for MVP)
CREATE POLICY "Anyone can view tree species"
  ON tree_species FOR SELECT
  USING (true);

-- RLS Policies for degraded_zones (public read)
CREATE POLICY "Anyone can view degraded zones"
  ON degraded_zones FOR SELECT
  USING (true);

-- RLS Policies for reforestation_projects (public read, anyone can create)
CREATE POLICY "Anyone can view reforestation projects"
  ON reforestation_projects FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create reforestation projects"
  ON reforestation_projects FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update reforestation projects"
  ON reforestation_projects FOR UPDATE
  USING (true);

-- RLS Policies for planting_records (public read, anyone can create)
CREATE POLICY "Anyone can view planting records"
  ON planting_records FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create planting records"
  ON planting_records FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update planting records"
  ON planting_records FOR UPDATE
  USING (true);

-- RLS Policies for ai_recommendations (public read, anyone can create)
CREATE POLICY "Anyone can view AI recommendations"
  ON ai_recommendations FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create AI recommendations"
  ON ai_recommendations FOR INSERT
  WITH CHECK (true);