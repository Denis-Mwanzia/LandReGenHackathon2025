import { useEffect, useState, useRef } from 'react';
import { supabase } from './lib/supabase';
import LandingPage from './components/LandingPage';
import MapView from './components/MapView';
import Dashboard from './components/Dashboard';
import AIRecommendations from './components/AIRecommendations';
import ProjectForm from './components/ProjectForm';
import PlantingRecordForm from './components/PlantingRecordForm';
import WeatherPanel from './components/WeatherPanel';
import ChatAssistant from './components/ChatAssistant';
import AIImageVerification from './components/AIImageVerification';
import AuthModal from './components/Auth/AuthModal';
import { toast, Toaster } from 'react-hot-toast';
import {
  TreePine,
  BarChart3,
  Sparkles,
  MapIcon,
  Leaf,
  Home,
  Cloud,
  Camera,
  Menu,
  X,
} from 'lucide-react';

type TabType =
  | 'home'
  | 'map'
  | 'dashboard'
  | 'ai'
  | 'projects'
  | 'planting'
  | 'weather'
  | 'chat'
  | 'verification';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedLocation, setSelectedLocation] = useState<
    { lat: number; lng: number } | undefined
  >();
  const [refreshKey, setRefreshKey] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (event === 'SIGNED_IN') {
        toast.success('Welcome to Kitui Reforest AI!');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    setActiveTab('ai');
  };

  const handleFormSuccess = () => {
    setRefreshKey((prev) => prev + 1);
    setActiveTab('map');
  };

  const tabs = [
    { id: 'home' as TabType, label: 'Home', icon: Home },
    { id: 'map' as TabType, label: 'Interactive Map', icon: MapIcon },
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: BarChart3 },
    { id: 'ai' as TabType, label: 'AI Recommendations', icon: Sparkles },
    { id: 'projects' as TabType, label: 'New Project', icon: TreePine },
    { id: 'planting' as TabType, label: 'Record Planting', icon: Leaf },
    { id: 'weather' as TabType, label: 'Climate Insights', icon: Cloud },
    { id: 'verification' as TabType, label: 'AI Verification', icon: Camera },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
      <header className="bg-white shadow-lg border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between py-3 sm:py-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="relative">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg sm:rounded-xl shadow-lg">
                  <TreePine size={20} className="text-white sm:w-7 sm:h-7" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent truncate">
                  Kitui Reforest AI
                </h1>
                <p className="text-slate-600 text-xs sm:text-sm font-medium truncate">
                  Regenerating Kitui with AI + Drones
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>System Active</span>
                </div>
              </div>

              {/* Auth Button */}
              <button
                onClick={() => setAuthModalOpen(true)}
                className="flex items-center gap-2 p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                {user && (
                  <span className="hidden sm:inline text-sm font-medium text-slate-700">
                    {user.user_metadata?.full_name || 'User'}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-14 sm:top-16 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg transform scale-105'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 hover:shadow-md'
                  }`}
                >
                  <Icon
                    size={16}
                    className={`sm:w-[18px] sm:h-[18px] transition-transform duration-200 ${
                      isActive ? 'scale-110' : 'group-hover:scale-105'
                    }`}
                  />
                  <span className="text-xs sm:text-sm font-semibold">
                    {tab.label}
                  </span>
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Mobile Navigation */}
          <div
            ref={mobileMenuRef}
            className="md:hidden flex items-center justify-between py-2"
          >
            <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
              {tabs.slice(0, 4).map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group flex items-center gap-1 px-2 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                        : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
                    }`}
                  >
                    <Icon size={16} />
                    <span className="text-xs font-semibold">
                      {tab.label.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
              title="More options"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-slate-200 py-2">
              <div className="grid grid-cols-2 gap-2">
                {tabs.slice(4).map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`group flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                          : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
                      }`}
                    >
                      <Icon size={16} />
                      <span className="text-sm font-semibold">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </nav>

      <main
        className={
          activeTab === 'home'
            ? ''
            : 'max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 lg:space-y-8'
        }
      >
        {activeTab === 'home' && (
          <LandingPage onGetStarted={() => setActiveTab('map')} />
        )}

        {activeTab === 'map' && (
          <div className="space-y-3 sm:space-y-4">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-4 sm:p-6 text-white">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2">
                Interactive GIS Map
              </h2>
              <p className="text-emerald-100 text-sm sm:text-base">
                Explore degraded zones and active reforestation projects across
                Kitui County
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
              <div className="h-80 sm:h-96 lg:h-[500px] xl:h-[600px]">
                <MapView
                  key={refreshKey}
                  onLocationSelect={handleLocationSelect}
                  allowPinDrop={false}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && <Dashboard key={refreshKey} />}

        {activeTab === 'ai' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">
                AI Tree Recommendations
              </h2>
              <p className="text-purple-100">
                {selectedLocation
                  ? `Get personalized species recommendations for ${selectedLocation.lat.toFixed(
                      4
                    )}, ${selectedLocation.lng.toFixed(4)}`
                  : 'Get AI-powered tree species recommendations based on soil, climate, and degradation data'}
              </p>
            </div>
            <AIRecommendations
              latitude={selectedLocation?.lat}
              longitude={selectedLocation?.lng}
            />
          </div>
        )}

        {activeTab === 'projects' && (
          <ProjectForm
            preselectedLocation={selectedLocation}
            onSuccess={handleFormSuccess}
          />
        )}

        {activeTab === 'planting' && (
          <PlantingRecordForm onSuccess={handleFormSuccess} />
        )}

        {activeTab === 'weather' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">Climate Insights</h2>
              <p className="text-blue-100">
                Weather forecasts and planting condition recommendations for
                optimal reforestation timing
              </p>
            </div>

            {selectedLocation ? (
              <WeatherPanel
                lat={selectedLocation.lat}
                lng={selectedLocation.lng}
              />
            ) : (
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Cloud className="text-blue-500" size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  Select a Location
                </h3>
                <p className="text-slate-600 mb-6 max-w-md mx-auto">
                  Choose a location on the Interactive Map to view weather
                  forecasts and planting recommendations for that specific area.
                </p>
                <button
                  onClick={() => setActiveTab('map')}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Go to Interactive Map
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'verification' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">AI Image Verification</h2>
              <p className="text-purple-100">
                Upload before/after drone photos for AI-powered vegetation
                growth analysis and restoration progress validation
              </p>
            </div>
            <AIImageVerification />
          </div>
        )}
      </main>

      {/* Chat Assistant - Always available */}
      <ChatAssistant />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        user={user}
        onUserChange={setUser}
      />

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10b981',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />

      <footer className="bg-gradient-to-r from-slate-800 to-slate-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                  <TreePine size={20} className="text-white" />
                </div>
                <h3 className="text-xl font-bold">Kitui Reforest AI</h3>
              </div>
              <p className="text-slate-300 text-sm mb-4 max-w-md">
                Using satellite data, AI, and community engagement to restore
                degraded lands in Kitui County, Kenya. Building a sustainable,
                greener future together.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-slate-400">
                  Land ReGen Hackathon 2025
                </span>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4 text-emerald-400">
                Features
              </h4>
              <ul className="text-slate-300 text-sm space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                  NDVI Analysis
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                  AI Recommendations
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                  Project Tracking
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                  Progress Monitoring
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4 text-emerald-400">
                Impact
              </h4>
              <p className="text-slate-300 text-sm mb-4">
                Empowering communities with data-driven reforestation decisions.
              </p>
              <div className="text-xs text-slate-400 space-y-1">
                <div>SDG 15: Life on Land</div>
                <div>Climate Resilience</div>
                <div>Community Engagement</div>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-slate-400 text-sm">
                &copy; 2025 Kitui Reforest AI - Regenerating Kitui with AI +
                Drones
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span>Built for Land ReGen Hackathon 2025</span>
                <span>•</span>
                <span>React + TypeScript + AI</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
