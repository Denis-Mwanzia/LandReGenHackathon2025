-- Add missing columns to existing tables
-- This migration adds the missing contact fields to reforestation_projects table

-- Add contact_email and contact_phone columns to reforestation_projects
ALTER TABLE reforestation_projects 
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS contact_phone TEXT;

-- Update existing sample data to include contact information
UPDATE reforestation_projects 
SET 
  contact_email = CASE 
    WHEN project_name = 'Kitui Green Initiative' THEN 'info@kituienvironmental.org'
    WHEN project_name = 'Mwingi Restoration Project' THEN 'contact@greenearthfoundation.org'
    WHEN project_name = 'Mutitu Hills Conservation' THEN 'conservation@kws.go.ke'
    ELSE NULL
  END,
  contact_phone = CASE 
    WHEN project_name = 'Kitui Green Initiative' THEN '+254 700 123 456'
    WHEN project_name = 'Mwingi Restoration Project' THEN '+254 700 789 012'
    WHEN project_name = 'Mutitu Hills Conservation' THEN '+254 20 800 0000'
    ELSE NULL
  END
WHERE contact_email IS NULL OR contact_phone IS NULL;

-- Verify the changes
SELECT project_name, contact_email, contact_phone 
FROM reforestation_projects 
ORDER BY project_name;
