import { useState, useRef } from 'react';
import { Upload, Camera, CheckCircle, XCircle, Eye, Bot } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

type VerificationResult = {
  vegetationGrowth: number;
  confidence: number;
  analysis: string;
  recommendations: string[];
  beforeImage?: string;
  afterImage?: string;
};

export default function AIImageVerification() {
  const [beforeImage, setBeforeImage] = useState<File | null>(null);
  const [afterImage, setAfterImage] = useState<File | null>(null);
  const [beforePreview, setBeforePreview] = useState<string>('');
  const [afterPreview, setAfterPreview] = useState<string>('');
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (
    file: File,
    setter: (file: File | null) => void,
    previewSetter: (preview: string) => void
  ) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      setError('Image size must be less than 10MB');
      return;
    }

    setter(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      previewSetter(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    setError(null);
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data:image/...;base64, prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const analyzeImages = async () => {
    if (!beforeImage || !afterImage) {
      setError('Please upload both before and after images');
      return;
    }

    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      setError('Gemini API key not configured');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const [beforeBase64, afterBase64] = await Promise.all([
        convertToBase64(beforeImage),
        convertToBase64(afterImage),
      ]);

      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

      const prompt = `
        You are an expert in vegetation analysis and reforestation monitoring. Analyze these two drone images of the same location taken at different times to assess vegetation growth and restoration progress.

        Image 1 (BEFORE): Taken before reforestation activities
        Image 2 (AFTER): Taken after reforestation activities

        Please provide a detailed analysis in the following JSON format:

        {
          "vegetationGrowth": <number from 0-100 representing percentage improvement in vegetation coverage>,
          "confidence": <number from 0-100 representing confidence in the analysis>,
          "analysis": "<detailed description of what you observe, including changes in vegetation density, tree growth, ground cover, etc.>",
          "recommendations": ["<recommendation 1>", "<recommendation 2>", "<recommendation 3>"]
        }

        Focus on:
        1. Vegetation density changes
        2. Tree growth and establishment
        3. Ground cover improvement
        4. Soil condition changes
        5. Overall restoration progress

        Be specific about what you see and provide actionable recommendations for improving the reforestation project.
      `;

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: beforeBase64,
            mimeType: beforeImage.type,
          },
        },
        {
          inlineData: {
            data: afterBase64,
            mimeType: afterImage.type,
          },
        },
      ]);

      const responseText = result.response.text();

      // Extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in AI response');
      }

      const analysisResult = JSON.parse(jsonMatch[0]);

      setResult({
        ...analysisResult,
        beforeImage: beforePreview,
        afterImage: afterPreview,
      });
    } catch (error) {
      console.error('Error analyzing images:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to analyze images'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetForm = () => {
    setBeforeImage(null);
    setAfterImage(null);
    setBeforePreview('');
    setAfterPreview('');
    setResult(null);
    setError(null);
    if (beforeInputRef.current) beforeInputRef.current.value = '';
    if (afterInputRef.current) afterInputRef.current.value = '';
  };

  const getGrowthStatus = (growth: number) => {
    if (growth >= 70)
      return {
        status: 'excellent',
        color: 'text-green-600',
        icon: CheckCircle,
      };
    if (growth >= 40)
      return { status: 'good', color: 'text-blue-600', icon: CheckCircle };
    if (growth >= 20)
      return {
        status: 'moderate',
        color: 'text-yellow-600',
        icon: CheckCircle,
      };
    return { status: 'needs attention', color: 'text-red-600', icon: XCircle };
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Bot className="text-purple-600" size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800">
            AI Image Verification
          </h3>
          <p className="text-slate-600 text-sm">
            Upload before/after drone photos for AI analysis
          </p>
        </div>
      </div>

      {!result ? (
        <>
          {/* Image Upload Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Before Image */}
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                <Camera size={16} />
                Before Image
              </h4>
              <div
                className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-emerald-400 transition-colors cursor-pointer"
                onClick={() => beforeInputRef.current?.click()}
              >
                {beforePreview ? (
                  <img
                    src={beforePreview}
                    alt="Before"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ) : (
                  <div className="py-8">
                    <Upload size={32} className="mx-auto text-slate-400 mb-2" />
                    <p className="text-slate-600">
                      Click to upload before image
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                )}
              </div>
              <input
                ref={beforeInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleImageUpload(file, setBeforeImage, setBeforePreview);
                  }
                }}
                className="hidden"
                aria-label="Upload before image"
              />
            </div>

            {/* After Image */}
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                <Camera size={16} />
                After Image
              </h4>
              <div
                className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-emerald-400 transition-colors cursor-pointer"
                onClick={() => afterInputRef.current?.click()}
              >
                {afterPreview ? (
                  <img
                    src={afterPreview}
                    alt="After"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ) : (
                  <div className="py-8">
                    <Upload size={32} className="mx-auto text-slate-400 mb-2" />
                    <p className="text-slate-600">
                      Click to upload after image
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                )}
              </div>
              <input
                ref={afterInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleImageUpload(file, setAfterImage, setAfterPreview);
                  }
                }}
                className="hidden"
                aria-label="Upload after image"
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Analyze Button */}
          <div className="flex justify-center">
            <button
              onClick={analyzeImages}
              disabled={!beforeImage || !afterImage || isAnalyzing}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Analyzing Images...
                </>
              ) : (
                <>
                  <Eye size={16} />
                  Analyze with AI
                </>
              )}
            </button>
          </div>
        </>
      ) : (
        /* Results Section */
        <div className="space-y-6">
          {/* Images Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-slate-800 mb-2">Before</h4>
              <img
                src={result.beforeImage}
                alt="Before"
                className="w-full h-48 object-cover rounded-lg border"
              />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 mb-2">After</h4>
              <img
                src={result.afterImage}
                alt="After"
                className="w-full h-48 object-cover rounded-lg border"
              />
            </div>
          </div>

          {/* Analysis Results */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-slate-800">
                AI Analysis Results
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">Confidence:</span>
                <span className="font-semibold">{result.confidence}%</span>
              </div>
            </div>

            {/* Growth Score */}
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-medium text-slate-700">
                  Vegetation Growth:
                </span>
                <span className="text-2xl font-bold text-slate-800">
                  {result.vegetationGrowth}%
                </span>
                {(() => {
                  const { color, icon: Icon } = getGrowthStatus(
                    result.vegetationGrowth
                  );
                  return <Icon className={color} size={20} />;
                })()}
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(result.vegetationGrowth, 100)}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Detailed Analysis */}
            <div className="mb-4">
              <h5 className="font-semibold text-slate-800 mb-2">
                Detailed Analysis:
              </h5>
              <p className="text-slate-700 text-sm leading-relaxed">
                {result.analysis}
              </p>
            </div>

            {/* Recommendations */}
            <div>
              <h5 className="font-semibold text-slate-800 mb-2">
                Recommendations:
              </h5>
              <ul className="space-y-1">
                {result.recommendations.map((rec, index) => (
                  <li
                    key={index}
                    className="text-slate-700 text-sm flex items-start gap-2"
                  >
                    <span className="text-purple-600 mt-1">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={resetForm}
              className="flex-1 bg-slate-600 text-white py-2 px-4 rounded-lg hover:bg-slate-700 transition-colors"
            >
              Analyze New Images
            </button>
            <button
              onClick={() => {
                const dataStr = JSON.stringify(result, null, 2);
                const dataBlob = new Blob([dataStr], {
                  type: 'application/json',
                });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `verification-analysis-${
                  new Date().toISOString().split('T')[0]
                }.json`;
                link.click();
              }}
              className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Download Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
