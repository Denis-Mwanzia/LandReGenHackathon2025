import { useState } from 'react';
import { supabase, TreeSpecies } from '../lib/supabase';
import { Sparkles, Leaf, Droplets, Mountain } from 'lucide-react';

type AIRecommendationsProps = {
  latitude?: number;
  longitude?: number;
  onRecommendationsGenerated?: (species: TreeSpecies[]) => void;
};

export default function AIRecommendations({ latitude, longitude, onRecommendationsGenerated }: AIRecommendationsProps) {
  const [loading, setLoading] = useState(false);
  const [soilType, setSoilType] = useState('loamy');
  const [rainfall, setRainfall] = useState(500);
  const [degradationScore, setDegradationScore] = useState(0.2);
  const [recommendations, setRecommendations] = useState<TreeSpecies[]>([]);

  const generateRecommendations = async () => {
    setLoading(true);
    try {
      // Fetch all tree species from database
      const { data: allSpecies, error } = await supabase
        .from('tree_species')
        .select('*');

      if (error) throw error;

      if (!allSpecies || allSpecies.length === 0) {
        alert('No tree species data available');
        return;
      }

      // AI-based filtering logic
      const suitableSpecies = allSpecies.filter((species: TreeSpecies) => {
        // Check rainfall compatibility
        const rainfallMatch = rainfall >= species.min_rainfall && rainfall <= species.max_rainfall;

        // Check soil type compatibility
        const soilMatch = species.soil_types.includes(soilType) || species.soil_types.includes('poor') || species.soil_types.includes('degraded');

        return rainfallMatch && soilMatch;
      });

      // Score and sort species
      const scoredSpecies = suitableSpecies.map((species: TreeSpecies) => {
        let score = 0;

        // Higher survival rate = better
        score += species.survival_rate * 0.4;

        // Exact soil match bonus
        if (species.soil_types.includes(soilType)) score += 15;

        // Fast growth bonus for severe degradation
        if (degradationScore < 0.2 && species.growth_rate === 'fast') score += 10;

        // Drought resistance bonus for low rainfall
        if (rainfall < 500 && species.benefits.some(b => b.toLowerCase().includes('drought'))) score += 12;

        // Soil improvement bonus for degraded areas
        if (degradationScore < 0.25 && species.benefits.some(b => b.toLowerCase().includes('soil'))) score += 10;

        return { ...species, score };
      });

      // Sort by score and take top 5
      const topRecommendations = scoredSpecies
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      setRecommendations(topRecommendations);

      if (onRecommendationsGenerated) {
        onRecommendationsGenerated(topRecommendations);
      }

      // Save recommendation to database
      if (latitude && longitude) {
        await supabase.from('ai_recommendations').insert({
          location_lat: latitude,
          location_lng: longitude,
          soil_type: soilType,
          rainfall: rainfall,
          degradation_score: degradationScore,
          recommended_species: topRecommendations.map(s => ({
            id: s.id,
            name: s.name,
            score: s.score
          })),
          planting_strategy: generatePlantingStrategy(degradationScore, rainfall, soilType)
        });
      }

    } catch (error) {
      console.error('Error generating recommendations:', error);
      alert('Failed to generate recommendations');
    } finally {
      setLoading(false);
    }
  };

  const generatePlantingStrategy = (degradation: number, rain: number, soil: string): string => {
    let strategy = '';

    if (degradation < 0.2) {
      strategy += 'SEVERE DEGRADATION PROTOCOL: Begin with pioneer species for soil stabilization. ';
    }

    if (rain < 500) {
      strategy += 'LOW RAINFALL AREA: Implement water harvesting techniques, use mulching, and plant during rainy season. ';
    } else {
      strategy += 'MODERATE RAINFALL: Plant at onset of rainy season with proper spacing. ';
    }

    if (soil === 'sandy') {
      strategy += 'SANDY SOIL: Add organic matter, use nitrogen-fixing species to improve soil structure. ';
    } else if (soil === 'clay') {
      strategy += 'CLAY SOIL: Ensure good drainage, avoid waterlogging during establishment. ';
    }

    strategy += 'Monitor survival rates monthly for first year. Replace failed seedlings within 3 months.';

    return strategy;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
          <Sparkles className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">AI Tree Recommendations</h2>
          <p className="text-sm text-slate-600">Get personalized species suggestions for your site</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <div className="flex items-center gap-2">
              <Mountain size={16} />
              Soil Type
            </div>
          </label>
          <select
            value={soilType}
            onChange={(e) => setSoilType(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="sandy">Sandy</option>
            <option value="loamy">Loamy</option>
            <option value="clay">Clay</option>
            <option value="rocky">Rocky</option>
            <option value="degraded">Degraded</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <div className="flex items-center gap-2">
              <Droplets size={16} />
              Annual Rainfall (mm)
            </div>
          </label>
          <input
            type="number"
            value={rainfall}
            onChange={(e) => setRainfall(Number(e.target.value))}
            min="200"
            max="1500"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <div className="flex items-center gap-2">
              <Leaf size={16} />
              NDVI Score
            </div>
          </label>
          <input
            type="number"
            value={degradationScore}
            onChange={(e) => setDegradationScore(Number(e.target.value))}
            min="-1"
            max="1"
            step="0.1"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      <button
        onClick={generateRecommendations}
        disabled={loading}
        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Analyzing...' : 'Generate AI Recommendations'}
      </button>

      {recommendations.length > 0 && (
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-bold text-slate-800">Recommended Species</h3>
          {recommendations.map((species, index) => (
            <div
              key={species.id}
              className="border border-slate-200 rounded-lg p-4 hover:border-emerald-500 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-bold text-slate-800">
                    #{index + 1} {species.name}
                  </h4>
                  <p className="text-sm text-slate-600 italic">{species.scientific_name}</p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-100 px-3 py-1 rounded-full">
                  <span className="text-sm font-semibold text-emerald-700">
                    {species.survival_rate}% survival
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-700 mb-3">{species.description}</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="font-medium">Growth Rate:</span> {species.growth_rate}
                </div>
                <div>
                  <span className="font-medium">Rainfall:</span> {species.min_rainfall}-{species.max_rainfall}mm
                </div>
              </div>
              <div className="mt-2">
                <span className="text-xs font-medium text-slate-700">Benefits: </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {species.benefits.slice(0, 4).map((benefit, i) => (
                    <span key={i} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-bold text-blue-900 mb-2">Planting Strategy</h4>
            <p className="text-sm text-blue-800">
              {generatePlantingStrategy(degradationScore, rainfall, soilType)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
