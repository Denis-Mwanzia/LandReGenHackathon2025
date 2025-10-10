import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  console.log('Starting database seed...');

  try {
    const csvPath = path.join(__dirname, '../data/kitui_reforest_dataset.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n').slice(1);

    const treeSpeciesMap = new Map<string, string>();

    for (const line of lines) {
      if (!line.trim()) continue;

      const parts = line.split(',');
      if (parts.length < 9) continue;

      const [location, lat, lng, soilType, degradationScore, rainfall, species, plantingMethod, survivalNotes] = parts;

      const speciesNames = species.split(';').map(s => s.trim());
      const survivalMatch = survivalNotes.match(/(\d+)%/);
      const survivalRate = survivalMatch ? parseInt(survivalMatch[1]) : 75;

      for (const speciesName of speciesNames) {
        if (!treeSpeciesMap.has(speciesName)) {
          const scientificName = getScientificName(speciesName);
          const { data, error } = await supabase
            .from('tree_species')
            .upsert({
              name: speciesName,
              scientific_name: scientificName,
              description: getSpeciesDescription(speciesName),
              min_rainfall: parseInt(rainfall) - 100,
              max_rainfall: parseInt(rainfall) + 200,
              soil_types: [soilType.toLowerCase().replace(' ', '_'), 'degraded', 'poor'],
              survival_rate: survivalRate,
              growth_rate: getGrowthRate(speciesName),
              benefits: getSpeciesBenefits(speciesName),
              planting_method: plantingMethod,
            }, { onConflict: 'name' })
            .select()
            .single();

          if (data && !error) {
            treeSpeciesMap.set(speciesName, data.id);
            console.log(`✓ Added tree species: ${speciesName}`);
          }
        }
      }

      const degradationLevel = parseFloat(degradationScore) < 0.3 ? 'severe' :
                               parseFloat(degradationScore) < 0.5 ? 'moderate' : 'mild';

      const { error: zoneError } = await supabase
        .from('degraded_zones')
        .upsert({
          zone_name: location,
          latitude: parseFloat(lat),
          longitude: parseFloat(lng),
          area_hectares: Math.random() * 50 + 10,
          ndvi_score: 1 - parseFloat(degradationScore),
          degradation_level: degradationLevel,
          soil_type: soilType,
          avg_rainfall: parseInt(rainfall),
          identified_date: new Date().toISOString(),
        }, { onConflict: 'zone_name' });

      if (!zoneError) {
        console.log(`✓ Added degraded zone: ${location}`);
      }
    }

    console.log('\n✓ Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

function getScientificName(commonName: string): string {
  const scientificNames: Record<string, string> = {
    'Melia volkensii': 'Melia volkensii',
    'Acacia tortilis': 'Vachellia tortilis',
    'Terminalia brownii': 'Terminalia brownii',
    'Croton megalocarpus': 'Croton megalocarpus',
    'Albizia gummifera': 'Albizia gummifera',
    'Faidherbia albida': 'Faidherbia albida',
    'Tamarindus indica': 'Tamarindus indica',
    'Grevillea robusta': 'Grevillea robusta',
    'Cordia africana': 'Cordia africana',
    'Ficus sycomorus': 'Ficus sycomorus',
    'Acacia senegal': 'Senegalia senegal',
    'Albizia anthelmintica': 'Albizia anthelmintica',
  };
  return scientificNames[commonName] || commonName;
}

function getSpeciesDescription(name: string): string {
  const descriptions: Record<string, string> = {
    'Melia volkensii': 'Drought-resistant indigenous tree excellent for arid lands',
    'Acacia tortilis': 'Hardy acacia species ideal for low rainfall areas',
    'Terminalia brownii': 'Native broadleaf tree for soil conservation',
    'Croton megalocarpus': 'Fast-growing indigenous tree with multiple uses',
    'Albizia gummifera': 'Nitrogen-fixing tree excellent for agroforestry',
    'Faidherbia albida': 'Unique nitrogen-fixing tree that loses leaves in rainy season',
    'Tamarindus indica': 'Fruit-bearing tree adapted to semi-arid conditions',
    'Grevillea robusta': 'Fast-growing tree for timber and soil stabilization',
    'Cordia africana': 'Indigenous tree with medicinal and timber value',
    'Ficus sycomorus': 'Large shade tree important for wildlife',
    'Acacia senegal': 'Gum arabic producing acacia for dryland areas',
    'Albizia anthelmintica': 'Medicinal tree species with soil enrichment properties',
  };
  return descriptions[name] || 'Native tree species suitable for Kitui County';
}

function getGrowthRate(name: string): string {
  const fastGrowing = ['Grevillea robusta', 'Croton megalocarpus', 'Melia volkensii'];
  const slowGrowing = ['Ficus sycomorus', 'Tamarindus indica'];

  if (fastGrowing.includes(name)) return 'fast';
  if (slowGrowing.includes(name)) return 'slow';
  return 'moderate';
}

function getSpeciesBenefits(name: string): string[] {
  const benefits: Record<string, string[]> = {
    'Melia volkensii': ['Drought tolerant', 'Timber production', 'Soil improvement'],
    'Acacia tortilis': ['Drought tolerant', 'Nitrogen fixation', 'Fodder for livestock'],
    'Terminalia brownii': ['Soil conservation', 'Timber', 'Medicinal uses'],
    'Croton megalocarpus': ['Fast growing', 'Timber', 'Oil production'],
    'Albizia gummifera': ['Nitrogen fixation', 'Agroforestry', 'Shade'],
    'Faidherbia albida': ['Nitrogen fixation', 'Fodder', 'Soil fertility'],
    'Tamarindus indica': ['Fruit production', 'Shade', 'Drought tolerant'],
    'Grevillea robusta': ['Fast growing', 'Timber', 'Windbreak'],
    'Cordia africana': ['Timber', 'Medicinal', 'Bee forage'],
    'Ficus sycomorus': ['Wildlife habitat', 'Shade', 'Fruit'],
    'Acacia senegal': ['Gum arabic', 'Drought tolerant', 'Nitrogen fixation'],
    'Albizia anthelmintica': ['Medicinal', 'Soil enrichment', 'Fodder'],
  };
  return benefits[name] || ['Climate resilience', 'Soil restoration', 'Biodiversity'];
}

seedDatabase();
