import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type TreeSpecies = {
  id: string;
  name: string;
  scientific_name: string;
  description: string;
  min_rainfall: number;
  max_rainfall: number;
  soil_types: string[];
  survival_rate: number;
  growth_rate: string;
  benefits: string[];
  planting_method: string;
  created_at: string;
};

export type DegradedZone = {
  id: string;
  zone_name: string;
  latitude: number;
  longitude: number;
  polygon_data?: any;
  area_hectares: number;
  ndvi_score: number;
  degradation_level: string;
  soil_type: string;
  avg_rainfall: number;
  identified_date: string;
  created_at: string;
};

export type ReforestationProject = {
  id: string;
  project_name: string;
  description: string;
  organization: string;
  contact_email: string;
  contact_phone: string;
  latitude: number;
  longitude: number;
  zone_id?: string;
  area_hectares: number;
  status: string;
  start_date: string;
  target_trees: number;
  created_at: string;
  updated_at: string;
};

export type PlantingRecord = {
  id: string;
  project_id: string;
  species_id: string;
  quantity: number;
  planting_date: string;
  latitude: number;
  longitude: number;
  survival_count?: number;
  last_monitored?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type AIRecommendation = {
  id: string;
  location_lat: number;
  location_lng: number;
  soil_type: string;
  rainfall: number;
  degradation_score: number;
  recommended_species: any[];
  planting_strategy: string;
  created_at: string;
};
