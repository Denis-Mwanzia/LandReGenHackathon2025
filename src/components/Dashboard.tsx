import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TreePine, TrendingUp, MapPin, Sprout, BarChart3 } from 'lucide-react';

type DashboardStats = {
  totalProjects: number;
  totalTreesPlanted: number;
  totalAreaCovered: number;
  averageSurvivalRate: number;
  projectsByStatus: Array<{ status: string; count: number }>;
  treesBySpecies: Array<{ name: string; count: number }>;
};

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Fetch projects
      const { data: projects } = await supabase
        .from('reforestation_projects')
        .select('*');

      // Fetch planting records with species info
      const { data: plantingRecords } = await supabase.from('planting_records')
        .select(`
          *,
          tree_species (
            name,
            scientific_name
          )
        `);

      if (!projects || !plantingRecords) return;

      // Calculate statistics
      const totalProjects = projects.length;
      const totalTreesPlanted = plantingRecords.reduce(
        (sum, record) => sum + record.quantity_planted,
        0
      );
      const totalAreaCovered = projects.reduce(
        (sum, project) => sum + (project.area_hectares || 0),
        0
      );

      // Calculate survival rate
      const recordsWithSurvival = plantingRecords.filter(
        (r) => r.survival_count !== null
      );
      const averageSurvivalRate =
        recordsWithSurvival.length > 0
          ? recordsWithSurvival.reduce((sum, r) => {
              const rate = (r.survival_count! / r.quantity_planted) * 100;
              return sum + rate;
            }, 0) / recordsWithSurvival.length
          : 0;

      // Projects by status
      const statusCounts = projects.reduce((acc, project) => {
        acc[project.status] = (acc[project.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const projectsByStatus = Object.entries(statusCounts).map(
        ([status, count]) => ({
          status: status.charAt(0).toUpperCase() + status.slice(1),
          count: count as number,
        })
      );

      // Trees by species
      const speciesCounts = plantingRecords.reduce((acc, record) => {
        const speciesName = (record as any).tree_species?.name || 'Unknown';
        acc[speciesName] = (acc[speciesName] || 0) + record.quantity_planted;
        return acc;
      }, {} as Record<string, number>);

      const treesBySpecies = Object.entries(speciesCounts)
        .map(([name, count]) => ({ name, count: count as number }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);

      setStats({
        totalProjects,
        totalTreesPlanted,
        totalAreaCovered,
        averageSurvivalRate,
        projectsByStatus,
        treesBySpecies,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600">Loading dashboard...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600">No data available</div>
      </div>
    );
  }

  const COLORS = [
    '#10b981',
    '#3b82f6',
    '#8b5cf6',
    '#f59e0b',
    '#ef4444',
    '#ec4899',
  ];

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-4 sm:p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <BarChart3 size={20} className="text-white sm:w-6 sm:h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">
            Community Progress Dashboard
          </h2>
        </div>
        <p className="text-sm sm:text-base text-emerald-100">
          Track reforestation impact and community engagement across Kitui
          County
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <MapPin size={20} className="sm:w-6 sm:h-6" />
            <div className="text-2xl sm:text-3xl font-bold">
              {stats.totalProjects}
            </div>
          </div>
          <div className="text-emerald-100 text-xs sm:text-sm font-medium">
            Total Projects
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <TreePine size={20} className="sm:w-6 sm:h-6" />
            <div className="text-2xl sm:text-3xl font-bold">
              {stats.totalTreesPlanted.toLocaleString()}
            </div>
          </div>
          <div className="text-green-100 text-xs sm:text-sm font-medium">
            Trees Planted
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Sprout size={20} className="sm:w-6 sm:h-6" />
            <div className="text-2xl sm:text-3xl font-bold">
              {stats.totalAreaCovered.toFixed(1)}
            </div>
          </div>
          <div className="text-teal-100 text-xs sm:text-sm font-medium">
            Hectares Covered
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp size={20} className="sm:w-6 sm:h-6" />
            <div className="text-2xl sm:text-3xl font-bold">
              {stats.averageSurvivalRate.toFixed(1)}%
            </div>
          </div>
          <div className="text-blue-100 text-xs sm:text-sm font-medium">
            Avg Survival Rate
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-3 sm:mb-4">
            Trees Planted by Species
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.treesBySpecies}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={100}
                fontSize={12}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">
            Projects by Status
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.projectsByStatus}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => `${entry.status}: ${entry.count}`}
              >
                {stats.projectsByStatus.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-emerald-900 mb-2">
          Impact Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-emerald-800">
          <div>
            <strong>Carbon Sequestration Estimate:</strong>
            <p className="text-2xl font-bold text-emerald-700 mt-1">
              {(stats.totalTreesPlanted * 0.02).toFixed(1)} tons CO₂/year
            </p>
          </div>
          <div>
            <strong>Community Engagement:</strong>
            <p className="text-2xl font-bold text-emerald-700 mt-1">
              {stats.totalProjects} communities
            </p>
          </div>
          <div>
            <strong>Land Restored:</strong>
            <p className="text-2xl font-bold text-emerald-700 mt-1">
              {stats.totalAreaCovered.toFixed(1)} hectares
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
