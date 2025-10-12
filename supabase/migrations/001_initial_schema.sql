-- Kitui Reforest AI - Complete Database Schema
-- Run this script in your Supabase SQL Editor to set up the entire database

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Create degraded_zones table
CREATE TABLE IF NOT EXISTS degraded_zones (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  area_hectares DECIMAL(10, 2) NOT NULL,
  degradation_level TEXT NOT NULL CHECK (degradation_level IN ('mild', 'moderate', 'severe')),
  ndvi_value DECIMAL(4, 3),
  soil_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tree_species table
CREATE TABLE IF NOT EXISTS tree_species (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  scientific_name TEXT,
  description TEXT,
  native_region TEXT,
  soil_preference TEXT,
  climate_preference TEXT,
  water_requirement TEXT,
  growth_rate TEXT,
  mature_height DECIMAL(5, 2),
  carbon_sequestration_kg_per_year DECIMAL(8, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_profiles table for role-based access
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'manager', 'volunteer', 'viewer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reforestation_projects table
CREATE TABLE IF NOT EXISTS reforestation_projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_name TEXT NOT NULL,
  organization TEXT NOT NULL,
  description TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  area_hectares DECIMAL(10, 2) NOT NULL,
  target_trees INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed', 'paused')),
  start_date DATE,
  end_date DATE,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create planting_records table
CREATE TABLE IF NOT EXISTS planting_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES reforestation_projects(id) ON DELETE CASCADE,
  species_id UUID REFERENCES tree_species(id),
  quantity_planted INTEGER NOT NULL,
  planting_date DATE NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  survival_count INTEGER,
  last_monitored DATE,
  notes TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_degraded_zones_location ON degraded_zones(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_projects_location ON reforestation_projects(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON reforestation_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_planting_records_project_id ON planting_records(project_id);
CREATE INDEX IF NOT EXISTS idx_planting_records_user_id ON planting_records(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE degraded_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE reforestation_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tree_species ENABLE ROW LEVEL SECURITY;
ALTER TABLE planting_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for degraded_zones (public read access)
CREATE POLICY "Public read access for degraded zones" ON degraded_zones
  FOR SELECT USING (true);

-- Policies for reforestation_projects
CREATE POLICY "Authenticated users can view projects" ON reforestation_projects
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Managers and admins can create projects" ON reforestation_projects
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Users can update own projects or admins can update any" ON reforestation_projects
  FOR UPDATE USING (
    auth.role() = 'authenticated' AND (
      user_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
      )
    )
  );

-- Policies for tree_species (public read access)
CREATE POLICY "Public read access for tree species" ON tree_species
  FOR SELECT USING (true);

-- Policies for planting_records
CREATE POLICY "Authenticated users can view planting records" ON planting_records
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Volunteers and above can create planting records" ON planting_records
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager', 'volunteer')
    )
  );

CREATE POLICY "Users can update own planting records or admins can update any" ON planting_records
  FOR UPDATE USING (
    auth.role() = 'authenticated' AND (
      user_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
      )
    )
  );

-- Policies for user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles" ON user_profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- DATABASE FUNCTIONS
-- =====================================================

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'viewer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to all tables
CREATE TRIGGER update_degraded_zones_updated_at BEFORE UPDATE ON degraded_zones FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_reforestation_projects_updated_at BEFORE UPDATE ON reforestation_projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tree_species_updated_at BEFORE UPDATE ON tree_species FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_planting_records_updated_at BEFORE UPDATE ON planting_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- SEED DATA
-- =====================================================

-- Insert common tree species for Kitui County, Kenya
INSERT INTO tree_species (name, scientific_name, description, native_region, soil_preference, climate_preference, water_requirement, growth_rate, mature_height, carbon_sequestration_kg_per_year) VALUES
('Acacia Tortilis', 'Acacia tortilis', 'Drought-resistant tree with umbrella-shaped canopy', 'Eastern Africa', 'Well-drained sandy soil', 'Semi-arid to arid', 'Low', 'Medium', 15.0, 25.0),
('Baobab', 'Adansonia digitata', 'Iconic tree with massive trunk and water storage', 'Sub-Saharan Africa', 'Sandy, well-drained soil', 'Tropical to subtropical', 'Low to moderate', 'Slow', 20.0, 35.0),
('Neem', 'Azadirachta indica', 'Medicinal tree with insect-repellent properties', 'Indian subcontinent', 'Various soil types', 'Tropical', 'Moderate', 'Fast', 18.0, 30.0),
('Mango', 'Mangifera indica', 'Fruit-bearing tree with dense canopy', 'Southeast Asia', 'Deep, well-drained soil', 'Tropical', 'Moderate to high', 'Medium', 25.0, 40.0),
('Papaya', 'Carica papaya', 'Fast-growing fruit tree', 'Central America', 'Well-drained soil', 'Tropical', 'High', 'Very fast', 8.0, 15.0),
('Guava', 'Psidium guajava', 'Hardy fruit tree with edible fruits', 'Central America', 'Various soil types', 'Tropical to subtropical', 'Moderate', 'Fast', 12.0, 20.0),
('Avocado', 'Persea americana', 'Nutrient-rich fruit tree', 'Central America', 'Well-drained, fertile soil', 'Subtropical', 'Moderate to high', 'Medium', 20.0, 35.0),
('Cashew', 'Anacardium occidentale', 'Nut-producing tree', 'Brazil', 'Sandy, well-drained soil', 'Tropical', 'Moderate', 'Medium', 15.0, 25.0),
('Citrus (Orange)', 'Citrus sinensis', 'Citrus fruit tree', 'Southeast Asia', 'Well-drained soil', 'Subtropical', 'Moderate to high', 'Medium', 12.0, 22.0),
('Passion Fruit', 'Passiflora edulis', 'Climbing vine with edible fruits', 'South America', 'Well-drained soil', 'Tropical to subtropical', 'High', 'Fast', 5.0, 12.0)
ON CONFLICT (name) DO NOTHING;

-- Insert sample degraded zones for Kitui County
INSERT INTO degraded_zones (name, description, latitude, longitude, area_hectares, degradation_level, ndvi_value, soil_type) VALUES
('Kitui Central Degraded Area', 'Heavily degraded area due to overgrazing and deforestation', -1.3667, 38.0138, 150.0, 'severe', 0.2, 'Sandy loam'),
('Mwingi West Erosion Zone', 'Soil erosion from agricultural activities', -1.1500, 38.2500, 75.5, 'moderate', 0.4, 'Clay loam'),
('Kitui South Dryland', 'Semi-arid area with low vegetation cover', -1.5000, 37.9000, 200.0, 'moderate', 0.3, 'Sandy'),
('Mutitu Hills Slope', 'Steep slopes with soil degradation', -1.2000, 38.1000, 45.0, 'mild', 0.5, 'Rocky loam'),
('Kitui East Plains', 'Flat area with moderate degradation', -1.3500, 38.2000, 120.0, 'mild', 0.6, 'Sandy loam')
ON CONFLICT (name) DO NOTHING;

-- Insert sample reforestation projects
INSERT INTO reforestation_projects (project_name, organization, description, latitude, longitude, area_hectares, target_trees, status, start_date) VALUES
('Kitui Green Initiative', 'Kitui Environmental Group', 'Community-led reforestation project focusing on native species', -1.3667, 38.0138, 25.0, 5000, 'active', '2024-01-15'),
('Mwingi Restoration Project', 'Green Earth Foundation', 'Large-scale restoration of degraded lands in Mwingi', -1.1500, 38.2500, 50.0, 10000, 'planning', '2024-03-01'),
('Mutitu Hills Conservation', 'Kenya Wildlife Service', 'Conservation project for hillside restoration', -1.2000, 38.1000, 15.0, 3000, 'active', '2023-11-20')
ON CONFLICT (project_name) DO NOTHING;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Verify tables were created
SELECT 'Tables created successfully' as status;

-- Check table counts
SELECT 
  'degraded_zones' as table_name, 
  COUNT(*) as record_count 
FROM degraded_zones
UNION ALL
SELECT 
  'tree_species' as table_name, 
  COUNT(*) as record_count 
FROM tree_species
UNION ALL
SELECT 
  'reforestation_projects' as table_name, 
  COUNT(*) as record_count 
FROM reforestation_projects;

-- Verify RLS is enabled
SELECT 
  schemaname, 
  tablename, 
  rowsecurity as rls_enabled 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
