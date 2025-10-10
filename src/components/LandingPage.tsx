import { TreePine, Map, Sparkles, BarChart3, Users, Satellite } from 'lucide-react';

type LandingPageProps = {
  onGetStarted: () => void;
};

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full mb-6 font-semibold text-sm">
              <Satellite size={16} />
              Land ReGen Hackathon 2025
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              Regenerating Kitui with
              <span className="block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                AI + Drones
              </span>
            </h1>

            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Empowering communities in Kitui County, Kenya to restore degraded land using
              artificial intelligence, satellite data, and community-driven reforestation
            </p>

            <button
              onClick={onGetStarted}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              <TreePine size={24} />
              Get Started
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center mb-4">
                <Map className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Interactive GIS Map</h3>
              <p className="text-slate-600">
                Visualize degraded zones using NDVI satellite data and track restoration projects across Kitui County
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">AI Tree Recommender</h3>
              <p className="text-slate-600">
                Get personalized native species recommendations based on soil type, rainfall, and degradation level
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Community Dashboard</h3>
              <p className="text-slate-600">
                Track total trees planted, hectares restored, and survival rates with real-time analytics
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-16">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white">
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-lg text-emerald-50">
                Building climate resilience through technology-powered reforestation
              </p>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">The Challenge</h3>
                  <p className="text-slate-600 mb-4">
                    Kitui County faces severe land degradation due to prolonged droughts,
                    deforestation, and unsustainable agricultural practices. Communities need
                    data-driven tools to make informed restoration decisions.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">Our Solution</h3>
                  <p className="text-slate-600 mb-4">
                    Kitui Reforest AI combines satellite imagery, machine learning, and local
                    knowledge to identify degraded areas and recommend drought-tolerant native
                    species that maximize survival rates and ecological impact.
                  </p>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-emerald-50 rounded-lg">
                  <div className="text-4xl font-bold text-emerald-700 mb-2">10+</div>
                  <div className="text-slate-600">Native Species</div>
                </div>

                <div className="text-center p-6 bg-teal-50 rounded-lg">
                  <div className="text-4xl font-bold text-teal-700 mb-2">1,000+</div>
                  <div className="text-slate-600">Hectares Mapped</div>
                </div>

                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <div className="text-4xl font-bold text-green-700 mb-2">80%+</div>
                  <div className="text-slate-600">Survival Rate</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Users size={32} />
              <h2 className="text-2xl font-bold">Built for Communities</h2>
            </div>
            <p className="text-slate-300 mb-6">
              This platform empowers local communities, NGOs, and government agencies to collaborate
              on reforestation projects, share knowledge, and track restoration progress together.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="font-bold mb-1">For Communities</div>
                <div className="text-slate-300">Plan and execute local reforestation projects</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="font-bold mb-1">For NGOs</div>
                <div className="text-slate-300">Monitor impact and optimize resource allocation</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="font-bold mb-1">For Government</div>
                <div className="text-slate-300">Track progress toward climate resilience goals</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
