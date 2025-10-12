-- Fix RLS Recursion Issues
-- This migration simplifies RLS policies to prevent infinite recursion

-- =====================================================
-- DISABLE RLS TEMPORARILY TO FIX RECURSION
-- =====================================================

-- Temporarily disable RLS on problematic tables
ALTER TABLE reforestation_projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE planting_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Allow authenticated users to view projects" ON reforestation_projects;
DROP POLICY IF EXISTS "Allow authenticated users to insert projects" ON reforestation_projects;
DROP POLICY IF EXISTS "Allow authenticated users to update projects" ON reforestation_projects;
DROP POLICY IF EXISTS "Allow authenticated users to view planting records" ON planting_records;
DROP POLICY IF EXISTS "Allow authenticated users to insert planting records" ON planting_records;
DROP POLICY IF EXISTS "Allow authenticated users to update planting records" ON planting_records;
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;

-- =====================================================
-- CREATE SIMPLIFIED RLS POLICIES
-- =====================================================

-- Re-enable RLS with simple policies
ALTER TABLE reforestation_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE planting_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Simple policies that don't reference user_profiles table (avoiding recursion)
CREATE POLICY "projects_select_policy" ON reforestation_projects
  FOR SELECT USING (true);

CREATE POLICY "projects_insert_policy" ON reforestation_projects
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "projects_update_policy" ON reforestation_projects
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "planting_records_select_policy" ON planting_records
  FOR SELECT USING (true);

CREATE POLICY "planting_records_insert_policy" ON planting_records
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "planting_records_update_policy" ON planting_records
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "user_profiles_select_policy" ON user_profiles
  FOR SELECT USING (auth.uid() = id OR auth.role() = 'authenticated');

CREATE POLICY "user_profiles_insert_policy" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "user_profiles_update_policy" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- =====================================================
-- VERIFY POLICIES
-- =====================================================

-- Check that policies are created correctly
SELECT 
  schemaname, 
  tablename, 
  policyname,
  cmd,
  CASE WHEN qual IS NOT NULL THEN 'Has condition' ELSE 'No condition' END as has_condition
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('reforestation_projects', 'planting_records', 'user_profiles')
ORDER BY tablename, policyname;

SELECT 'RLS recursion fix completed successfully!' as status;
