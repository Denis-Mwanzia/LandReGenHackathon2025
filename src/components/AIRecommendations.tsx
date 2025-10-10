import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Sparkles } from 'lucide-react';
import { fallbackRecommendations } from '../data/fallbackRecommendations';
import { GoogleGenerativeAI } from '@google/generative-ai'; // ✅ New SDK import

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY); // ✅ consistent with Node logic

const AIRecommendations = () => {
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

      const prompt = `
        You are an agroforestry and land restoration expert.
        Recommend 3 drought-resistant tree species for Kitui County based on:
        - Soil Type: ${soilType}
        - Annual Rainfall: ${rainfall} mm
        - Degradation Level: ${degradationScore}

        Respond in JSON format only:
        {
          "recommendations": [
            {
              "species": "Tree name",
              "survivalRate": "XX%",
              "planting": "Planting instructions",
              "benefits": "Main benefits"
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
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-6 h-6 text-green-600" />
        <h2 className="text-2xl font-semibold">AI Tree Recommendations</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Soil Type"
          value={soilType}
          onChange={(e) => setSoilType(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Rainfall (mm/year)"
          value={rainfall}
          onChange={(e) => setRainfall(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Degradation Level"
          value={degradationScore}
          onChange={(e) => setDegradationScore(e.target.value)}
          className="p-2 border rounded"
        />
      </div>

      <button
        onClick={generateRecommendations}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
      >
        {loading ? 'Generating...' : 'Get Recommendations'}
      </button>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.map((spec, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">{spec.species}</h3>
            <p className="text-green-600 font-medium mb-2">
              Survival Rate: {spec.survivalRate}
            </p>
            <div className="mb-2">
              <h4 className="font-medium">Planting Instructions:</h4>
              <p className="text-gray-600">{spec.planting}</p>
            </div>
            <div>
              <h4 className="font-medium">Benefits:</h4>
              <p className="text-gray-600">{spec.benefits}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIRecommendations;
