# Database Migration Guide for Kitui Reforest AI

## Overview

This guide provides step-by-step instructions to fix the database schema issues that are preventing project creation and planting record functionality.

## Issues Identified

1. **Infinite Recursion Error (42P17)**: RLS policies are causing circular references
2. **Missing Contact Fields**: `contact_email` and `contact_phone` may not exist in `reforestation_projects` table
3. **Field Name Mismatch**: `quantity` vs `quantity_planted` in `planting_records` table

## Migration Files Created

### 1. `003_comprehensive_schema_fix.sql`

- Adds missing contact fields to projects table
- Ensures `quantity_planted` field exists in planting records
- Updates sample data with contact information
- Fixes RLS policies to prevent recursion

### 2. `004_fix_rls_recursion.sql`

- Specifically addresses the infinite recursion issue
- Simplifies RLS policies to avoid circular references
- Provides a clean slate for RLS configuration

## Step-by-Step Migration Instructions

### Step 1: Access Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Run Comprehensive Schema Fix

1. Copy the entire content of `supabase/migrations/003_comprehensive_schema_fix.sql`
2. Paste it into the SQL Editor
3. Click **Run** to execute the migration
4. Wait for completion (should show success message)

### Step 3: Fix RLS Recursion (if still experiencing issues)

1. Copy the entire content of `supabase/migrations/004_fix_rls_recursion.sql`
2. Paste it into the SQL Editor
3. Click **Run** to execute the migration
4. Wait for completion (should show success message)

### Step 4: Verify Migration Success

Run this verification query in the SQL Editor:

```sql
-- Verify tables have all required columns
SELECT 
  'reforestation_projects' as table_name,
  column_name,
  data_type
FROM information_schema.columns 
WHERE table_name = 'reforestation_projects' 
  AND column_name IN ('project_name', 'organization', 'description', 'contact_email', 'contact_phone', 
                      'latitude', 'longitude', 'area_hectares', 'target_trees', 'status', 'start_date')
ORDER BY column_name;

SELECT 
  'planting_records' as table_name,
  column_name,
  data_type
FROM information_schema.columns 
WHERE table_name = 'planting_records' 
  AND column_name IN ('project_id', 'species_id', 'quantity_planted', 'planting_date', 
                      'latitude', 'longitude', 'survival_count', 'last_monitored', 'notes')
ORDER BY column_name;
```

## Expected Results After Migration

### ✅ What Should Work

- **Authentication**: User login/logout functionality
- **Project Creation**: Create new projects with contact information
- **Planting Records**: Record planting activities with correct field names
- **Dashboard**: View project statistics and data
- **All Forms**: Contact fields and quantity_planted field working correctly

### 🔧 Frontend Form Fields Covered

#### Project Creation Form

- ✅ Project Name (`project_name`)
- ✅ Organization (`organization`)
- ✅ Description (`description`)
- ✅ Contact Email (`contact_email`)
- ✅ Contact Phone (`contact_phone`)
- ✅ Latitude (`latitude`)
- ✅ Longitude (`longitude`)
- ✅ Area in Hectares (`area_hectares`)
- ✅ Target Trees (`target_trees`)
- ✅ Status (`status`)
- ✅ Start Date (`start_date`)

#### Planting Record Form

- ✅ Project Selection (`project_id`)
- ✅ Tree Species (`species_id`)
- ✅ Quantity Planted (`quantity_planted`)
- ✅ Planting Date (`planting_date`)
- ✅ Latitude (`latitude`)
- ✅ Longitude (`longitude`)
- ✅ Survival Count (`survival_count`)
- ✅ Last Monitored (`last_monitored`)
- ✅ Notes (`notes`)

## Troubleshooting

### If Migration Fails

1. Check the error message in Supabase SQL Editor
2. Ensure you have proper permissions to modify the database
3. Try running the migrations one at a time
4. Check if tables already exist and have conflicting data

### If Infinite Recursion Persists

1. Run `004_fix_rls_recursion.sql` migration
2. This specifically addresses the RLS policy recursion issue
3. The migration temporarily disables RLS and recreates simple policies

### If Contact Fields Still Missing

1. Manually add the columns using:

```sql
ALTER TABLE reforestation_projects ADD COLUMN contact_email TEXT;
ALTER TABLE reforestation_projects ADD COLUMN contact_phone TEXT;
```

## Testing After Migration

After running the migrations, test the following:

1. **Authentication**: Sign in with your credentials
2. **Project Creation**: Create a new project with all fields
3. **Planting Records**: Record a planting activity
4. **Dashboard**: Check that data appears correctly

## Support

If you encounter any issues:

1. Check the Supabase logs in the Dashboard
2. Verify the migration ran successfully
3. Test individual form fields to identify specific issues
4. Contact support with specific error messages

## Success Indicators

You'll know the migration was successful when:

- ✅ No more "infinite recursion" errors
- ✅ Project creation form saves successfully
- ✅ Planting record form saves successfully
- ✅ All form fields are properly populated
- ✅ Dashboard shows updated statistics
