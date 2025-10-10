import { useState, useEffect } from 'react';
import { supabase, TreeSpecies, ReforestationProject } from '../lib/supabase';
import { Sprout, Plus, X } from 'lucide-react';

type PlantingRecordFormProps = {
  projectId?: string;
  onSuccess?: () => void;
};

export default function PlantingRecordForm({ projectId, onSuccess }: PlantingRecordFormProps) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<ReforestationProject[]>([]);
  const [species, setSpecies] = useState<TreeSpecies[]>([]);

  const [formData, setFormData] = useState({
    project_id: projectId || '',
    species_id: '',
    quantity: 0,
    planting_date: new Date().toISOString().split('T')[0],
    latitude: -1.3667,
    longitude: 38.01,
    survival_count: null as number | null,
    last_monitored: '',
    notes: '',
  });

  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      const [projectsResult, speciesResult] = await Promise.all([
        supabase.from('reforestation_projects').select('*').order('project_name'),
        supabase.from('tree_species').select('*').order('name'),
      ]);

      if (projectsResult.data) setProjects(projectsResult.data);
      if (speciesResult.data) setSpecies(speciesResult.data);
    } catch (error) {
      console.error('Error loading options:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const recordData = {
        ...formData,
        survival_count: formData.survival_count || null,
        last_monitored: formData.last_monitored || null,
      };

      const { error } = await supabase
        .from('planting_records')
        .insert([recordData]);

      if (error) throw error;

      alert('Planting record created successfully!');
      setShowForm(false);
      setFormData({
        project_id: projectId || '',
        species_id: '',
        quantity: 0,
        planting_date: new Date().toISOString().split('T')[0],
        latitude: -1.3667,
        longitude: 38.01,
        survival_count: null,
        last_monitored: '',
        notes: '',
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error creating record:', error);
      alert('Failed to create planting record');
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
      >
        <Sprout size={20} />
        Record Planting Activity
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Sprout className="text-green-600" size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Record Planting Activity</h3>
        </div>
        <button
          onClick={() => setShowForm(false)}
          className="text-slate-500 hover:text-slate-700"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Project *
            </label>
            <select
              required
              value={formData.project_id}
              onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.project_name} ({project.organization})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tree Species *
            </label>
            <select
              required
              value={formData.species_id}
              onChange={(e) => setFormData({ ...formData, species_id: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select a species</option>
              {species.map((sp) => (
                <option key={sp.id} value={sp.id}>
                  {sp.name} ({sp.scientific_name})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Quantity Planted *
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., 500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Planting Date *
            </label>
            <input
              type="date"
              required
              value={formData.planting_date}
              onChange={(e) => setFormData({ ...formData, planting_date: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Latitude *
            </label>
            <input
              type="number"
              step="0.0001"
              required
              value={formData.latitude}
              onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Longitude *
            </label>
            <input
              type="number"
              step="0.0001"
              required
              value={formData.longitude}
              onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Survival Count (Optional)
            </label>
            <input
              type="number"
              min="0"
              value={formData.survival_count || ''}
              onChange={(e) => setFormData({
                ...formData,
                survival_count: e.target.value ? parseInt(e.target.value) : null
              })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Trees surviving"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Last Monitored (Optional)
            </label>
            <input
              type="date"
              value={formData.last_monitored}
              onChange={(e) => setFormData({ ...formData, last_monitored: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Add any additional observations or notes..."
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Record'}
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
