import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import LandingPage from './components/LandingPage';
import MapView from './components/MapView';
import Dashboard from './components/Dashboard';
import AIRecommendations from './components/AIRecommendations';
import ProjectForm from './components/ProjectForm';
import PlantingRecordForm from './components/PlantingRecordForm';
import {
  TreePine,
  BarChart3,
  Sparkles,
  MapIcon,
  Leaf,
  Home,
} from 'lucide-react';

type TabType = 'home' | 'map' | 'dashboard' | 'ai' | 'projects' | 'planting';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedLocation, setSelectedLocation] = useState<
    { lat: number; lng: number } | undefined
  >();
  const [refreshKey, setRefreshKey] = useState(0);
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

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
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
      <header className="bg-gradient-to-r from-emerald-700 via-green-600 to-teal-700 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <TreePine size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Kitui Reforest AI</h1>
                <p className="text-emerald-100 text-sm mt-1">
                  Restoring Kitui County with AI-powered land restoration
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white shadow-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-emerald-700 border-b-2 border-emerald-600 bg-emerald-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <main
        className={
          activeTab === 'home'
            ? ''
            : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'
        }
      >
        {activeTab === 'home' && (
          <LandingPage onGetStarted={() => setActiveTab('map')} />
        )}

        {activeTab === 'map' && (
          <div
            className="bg-white rounded-xl shadow-lg overflow-hidden"
            style={{ height: '600px' }}
          >
            <MapView
              key={refreshKey}
              onLocationSelect={handleLocationSelect}
              allowPinDrop={false}
            />
          </div>
        )}

        {activeTab === 'dashboard' && <Dashboard key={refreshKey} />}

        {activeTab === 'ai' && (
          <AIRecommendations
            latitude={selectedLocation?.lat}
            longitude={selectedLocation?.lng}
          />
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
      </main>

      <footer className="bg-slate-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-3">
                About Kitui Reforest AI
              </h3>
              <p className="text-slate-300 text-sm">
                Using satellite data, AI, and community engagement to restore
                degraded lands in Kitui County, Kenya. Building a sustainable,
                greener future together.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-3">Key Features</h3>
              <ul className="text-slate-300 text-sm space-y-1">
                <li>• Degraded land detection with NDVI analysis</li>
                <li>• AI-powered tree species recommendations</li>
                <li>• Community project tracking</li>
                <li>• Real-time progress monitoring</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-3">Impact</h3>
              <p className="text-slate-300 text-sm">
                Empowering local communities and NGOs to make data-driven
                reforestation decisions that restore ecosystems and improve
                livelihoods.
              </p>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-6 text-center text-slate-400 text-sm">
            <p>
              Kitui Reforest AI &copy; 2025 - Restoring land, rebuilding
              communities
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
