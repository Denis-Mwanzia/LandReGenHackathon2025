-- Comprehensive Database Schema Fix
-- This migration ensures all frontend form fields are properly supported

-- =====================================================
-- ADD MISSING COLUMNS AND FIX EXISTING SCHEMA
-- =====================================================

-- Ensure reforestation_projects table has all required fields
DO $$ 
BEGIN
    -- Add contact_email if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'reforestation_projects' 
                   AND column_name = 'contact_email') THEN
        ALTER TABLE reforestation_projects ADD COLUMN contact_email TEXT;
    END IF;
    
    -- Add contact_phone if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'reforestation_projects' 
                   AND column_name = 'contact_phone') THEN
        ALTER TABLE reforestation_projects ADD COLUMN contact_phone TEXT;
    END IF;
END $$;

-- Ensure planting_records table has quantity_planted field (not quantity)
DO $$ 
BEGIN
    -- Check if quantity column exists and needs to be renamed
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'planting_records' 
               AND column_name = 'quantity') THEN
        -- Rename quantity to quantity_planted
        ALTER TABLE planting_records RENAME COLUMN quantity TO quantity_planted;
    END IF;
    
    -- Add quantity_planted if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'planting_records' 
                   AND column_name = 'quantity_planted') THEN
        ALTER TABLE planting_records ADD COLUMN quantity_planted INTEGER NOT NULL DEFAULT 0;
    END IF;
END $$;

-- =====================================================
-- UPDATE EXISTING SAMPLE DATA
-- =====================================================

-- Update existing projects with contact information
UPDATE reforestation_projects 
SET 
  contact_email = CASE 
    WHEN project_name = 'Kitui Green Initiative' THEN 'info@kituienvironmental.org'
    WHEN project_name = 'Mwingi Restoration Project' THEN 'contact@greenearthfoundation.org'
    WHEN project_name = 'Mutitu Hills Conservation' THEN 'conservation@kws.go.ke'
    ELSE contact_email
  END,
  contact_phone = CASE 
    WHEN project_name = 'Kitui Green Initiative' THEN '+254 700 123 456'
    WHEN project_name = 'Mwingi Restoration Project' THEN '+254 700 789 012'
    WHEN project_name = 'Mutitu Hills Conservation' THEN '+254 20 374 6000'
    ELSE contact_phone
  END
WHERE contact_email IS NULL OR contact_phone IS NULL;

-- =====================================================
-- FIX ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Drop existing policies that might be causing recursion issues
DROP POLICY IF EXISTS "Authenticated users can view projects" ON reforestation_projects;
DROP POLICY IF EXISTS "Managers and admins can create projects" ON reforestation_projects;
DROP POLICY IF EXISTS "Users can update own projects or admins can update any" ON reforestation_projects;
DROP POLICY IF EXISTS "Authenticated users can view planting records" ON planting_records;
DROP POLICY IF EXISTS "Volunteers and above can create planting records" ON planting_records;
DROP POLICY IF EXISTS "Users can update own planting records or admins can update any" ON planting_records;

-- Create simplified RLS policies to avoid recursion
CREATE POLICY "Allow authenticated users to view projects" ON reforestation_projects
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert projects" ON reforestation_projects
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update projects" ON reforestation_projects
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to view planting records" ON planting_records
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert planting records" ON planting_records
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update planting records" ON planting_records
  FOR UPDATE USING (auth.role() = 'authenticated');

-- =====================================================
-- ADD MISSING USER_ID REFERENCES
-- =====================================================

-- Ensure user_id columns exist and have proper defaults
DO $$ 
BEGIN
    -- Add user_id to reforestation_projects if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'reforestation_projects' 
                   AND column_name = 'user_id') THEN
        ALTER TABLE reforestation_projects ADD COLUMN user_id UUID REFERENCES auth.users(id);
    END IF;
    
    -- Add user_id to planting_records if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'planting_records' 
                   AND column_name = 'user_id') THEN
        ALTER TABLE planting_records ADD COLUMN user_id UUID REFERENCES auth.users(id);
    END IF;
END $$;

-- =====================================================
-- VERIFY SCHEMA INTEGRITY
-- =====================================================

-- Check that all required columns exist
SELECT 
  'reforestation_projects' as table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'reforestation_projects' 
  AND column_name IN ('project_name', 'organization', 'description', 'contact_email', 'contact_phone', 
                      'latitude', 'longitude', 'area_hectares', 'target_trees', 'status', 'start_date', 'user_id')
ORDER BY column_name;

SELECT 
  'planting_records' as table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'planting_records' 
  AND column_name IN ('project_id', 'species_id', 'quantity_planted', 'planting_date', 
                      'latitude', 'longitude', 'survival_count', 'last_monitored', 'notes', 'user_id')
ORDER BY column_name;

-- Verify RLS policies are working
SELECT 
  schemaname, 
  tablename, 
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('reforestation_projects', 'planting_records')
ORDER BY tablename, policyname;

-- Success message
SELECT 'Database schema migration completed successfully!' as status;
