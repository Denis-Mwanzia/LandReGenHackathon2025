import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Sparkles } from 'lucide-react';
import { fallbackRecommendations } from '../data/fallbackRecommendations';
import { GoogleGenerativeAI } from '@google/generative-ai'; // ✅ New SDK import

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY); // ✅ consistent with Node logic

type AIRecommendationsProps = {
  latitude?: number;
  longitude?: number;
};

const AIRecommendations = ({ latitude, longitude }: AIRecommendationsProps) => {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(
    fallbackRecommendations
  );
  const [soilType, setSoilType] = useState('');
  const [rainfall, setRainfall] = useState('');
  const [degradationScore, setDegradationScore] = useState('');

  const generateRecommendations = async () => {
    setLoading(true);
    try {
      if (!import.meta.env.VITE_GEMINI_API_KEY) {
        throw new Error('Gemini API key missing');
      }

      const locationContext =
        latitude && longitude
          ? `Location: ${latitude.toFixed(4)}, ${longitude.toFixed(
              4
            )} (Kitui County, Kenya)`
          : 'Location: Kitui County, Kenya (general recommendations)';

      const prompt = `
        You are an agroforestry and land restoration expert specializing in semi-arid regions of Kenya.
        
        ${locationContext}
        
        Recommend 3 drought-resistant native tree species based on:
        - Soil Type: ${soilType || 'Not specified'}
        - Annual Rainfall: ${rainfall || 'Not specified'} mm
        - Degradation Level: ${degradationScore || 'Not specified'}
        
        Focus on species that:
        - Are native to Kitui County and surrounding regions
        - Thrive in semi-arid conditions (400-800mm annual rainfall)
        - Provide multiple benefits (timber, fodder, soil improvement, etc.)
        - Have proven survival rates in degraded lands
        
        Respond in JSON format only:
        {
          "recommendations": [
            {
              "species": "Common name (Scientific name)",
              "survivalRate": "XX%",
              "planting": "Detailed planting instructions including spacing, timing, and care",
              "benefits": "Primary ecological and economic benefits"
            }
          ]
        }
      `;

      // ✅ Correct Gemini model initialization
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      // ✅ Generate response
      const result = await model.generateContent(prompt);
      const text = result.response.text();

      // ✅ Extract JSON safely
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No valid JSON found in model response');

      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.recommendations && Array.isArray(parsed.recommendations)) {
        setRecommendations(parsed.recommendations);
        toast.success('✅ AI recommendations generated!');
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (err) {
      console.error('Error generating recommendations:', err);
      toast.error('⚠️ Using fallback recommendations');
      setRecommendations(fallbackRecommendations);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">
          Species Recommendations
        </h2>
      </div>

      <div className="bg-slate-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">
          Site Conditions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Soil Type
            </label>
            <input
              type="text"
              placeholder="e.g., Clay, Sandy, Loam"
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Rainfall (mm/year)
            </label>
            <input
              type="number"
              placeholder="e.g., 600"
              value={rainfall}
              onChange={(e) => setRainfall(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Degradation Level
            </label>
            <input
              type="text"
              placeholder="e.g., Severe, Moderate, Mild"
              value={degradationScore}
              onChange={(e) => setDegradationScore(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-8">
        <button
          onClick={generateRecommendations}
          disabled={loading}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Generating...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Get AI Recommendations
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {recommendations.map((spec, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">
                {spec.species}
              </h3>
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                {spec.survivalRate}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  Planting Instructions
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {spec.planting}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  Benefits
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {spec.benefits}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIRecommendations;
