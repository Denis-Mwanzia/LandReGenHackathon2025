import {
  TreePine,
  Map,
  Sparkles,
  BarChart3,
  Users,
  Satellite,
} from 'lucide-react';

type LandingPageProps = {
  onGetStarted: () => void;
};

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3 sm:px-4 py-2 rounded-full mb-4 sm:mb-6 font-semibold text-xs sm:text-sm">
              <Satellite size={14} className="sm:w-4 sm:h-4" />
              Land ReGen Hackathon 2025
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight">
              Regenerating Kitui with
              <span className="block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                AI + Drones
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
              Empowering communities in Kitui County, Kenya to restore degraded
              land using artificial intelligence, satellite data, and
              community-driven reforestation
            </p>

            <button
              onClick={onGetStarted}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95"
            >
              <TreePine size={20} className="sm:w-6 sm:h-6" />
              Get Started
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <Map className="text-white sm:w-6 sm:h-6" size={20} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">
                Interactive GIS Map
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Visualize degraded zones using NDVI satellite data and track
                restoration projects across Kitui County
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <Sparkles className="text-white sm:w-6 sm:h-6" size={20} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">
                AI Tree Recommender
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Get personalized native species recommendations based on soil
                type, rainfall, and degradation level
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 sm:col-span-2 lg:col-span-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <BarChart3 className="text-white sm:w-6 sm:h-6" size={20} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">
                Community Dashboard
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Track total trees planted, hectares restored, and survival rates
                with real-time analytics
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-12 sm:mb-16">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 sm:p-8 text-white">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
                Our Mission
              </h2>
              <p className="text-base sm:text-lg text-emerald-50">
                Building climate resilience through technology-powered
                reforestation
              </p>
            </div>

            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3">
                    The Challenge
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 mb-4 leading-relaxed">
                    Kitui County faces severe land degradation due to prolonged
                    droughts, deforestation, and unsustainable agricultural
                    practices. Communities need data-driven tools to make
                    informed restoration decisions.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3">
                    Our Solution
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 mb-4 leading-relaxed">
                    Kitui Reforest AI combines satellite imagery, machine
                    learning, and local knowledge to identify degraded areas and
                    recommend drought-tolerant native species that maximize
                    survival rates and ecological impact.
                  </p>
                </div>
              </div>

              <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div className="text-center p-4 sm:p-6 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">
                  <div className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-2">
                    10+
                  </div>
                  <div className="text-sm sm:text-base text-slate-600">
                    Native Species
                  </div>
                </div>

                <div className="text-center p-4 sm:p-6 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors">
                  <div className="text-3xl sm:text-4xl font-bold text-teal-700 mb-2">
                    1,000+
                  </div>
                  <div className="text-sm sm:text-base text-slate-600">
                    Hectares Mapped
                  </div>
                </div>

                <div className="text-center p-4 sm:p-6 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <div className="text-3xl sm:text-4xl font-bold text-green-700 mb-2">
                    80%+
                  </div>
                  <div className="text-sm sm:text-base text-slate-600">
                    Survival Rate
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Users size={28} className="sm:w-8 sm:h-8" />
              <h2 className="text-xl sm:text-2xl font-bold">
                Built for Communities
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-300 mb-6 leading-relaxed">
              This platform empowers local communities, NGOs, and government
              agencies to collaborate on reforestation projects, share
              knowledge, and track restoration progress together.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors">
                <div className="font-bold mb-1">For Communities</div>
                <div className="text-slate-300 text-xs sm:text-sm">
                  Plan and execute local reforestation projects
                </div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors">
                <div className="font-bold mb-1">For NGOs</div>
                <div className="text-slate-300 text-xs sm:text-sm">
                  Monitor impact and optimize resource allocation
                </div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors">
                <div className="font-bold mb-1">For Government</div>
                <div className="text-slate-300 text-xs sm:text-sm">
                  Track progress toward climate resilience goals
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
