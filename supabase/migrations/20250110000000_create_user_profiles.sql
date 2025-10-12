-- Create user_profiles table for role-based access control
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'manager', 'volunteer', 'viewer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile (except role)
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM user_profiles WHERE id = auth.uid()));

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles" ON user_profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

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

-- Update existing projects and planting_records to include user_id
-- Add user_id column to reforestation_projects if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reforestation_projects' 
    AND column_name = 'user_id'
  ) THEN
    ALTER TABLE reforestation_projects ADD COLUMN user_id UUID REFERENCES auth.users(id);
  END IF;
END $$;

-- Add user_id column to planting_records if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'planting_records' 
    AND column_name = 'user_id'
  ) THEN
    ALTER TABLE planting_records ADD COLUMN user_id UUID REFERENCES auth.users(id);
  END IF;
END $$;

-- Update RLS policies for projects
DROP POLICY IF EXISTS "Enable read access for all users" ON reforestation_projects;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON reforestation_projects;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON reforestation_projects;

-- All authenticated users can view projects
CREATE POLICY "Authenticated users can view projects" ON reforestation_projects
  FOR SELECT USING (auth.role() = 'authenticated');

-- Users can create projects (managers and admins)
CREATE POLICY "Managers and admins can create projects" ON reforestation_projects
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Users can update their own projects or admins can update any
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

-- Update RLS policies for planting_records
DROP POLICY IF EXISTS "Enable read access for all users" ON planting_records;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON planting_records;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON planting_records;

-- All authenticated users can view planting records
CREATE POLICY "Authenticated users can view planting records" ON planting_records
  FOR SELECT USING (auth.role() = 'authenticated');

-- Volunteers, managers, and admins can create planting records
CREATE POLICY "Volunteers and above can create planting records" ON planting_records
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager', 'volunteer')
    )
  );

-- Users can update their own planting records or admins can update any
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_reforestation_projects_user_id ON reforestation_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_planting_records_user_id ON planting_records(user_id);
