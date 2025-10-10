import { useState } from 'react';
import { supabase, TreeSpecies } from '../lib/supabase';
import { MapPin, Plus, X } from 'lucide-react';

type ProjectFormProps = {
  onSuccess?: () => void;
  preselectedLocation?: { lat: number; lng: number };
};

export default function ProjectForm({ onSuccess, preselectedLocation }: ProjectFormProps) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    project_name: '',
    description: '',
    organization: '',
    contact_email: '',
    contact_phone: '',
    latitude: preselectedLocation?.lat || -1.3667,
    longitude: preselectedLocation?.lng || 38.01,
    area_hectares: 0,
    status: 'planning',
    start_date: new Date().toISOString().split('T')[0],
    target_trees: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('reforestation_projects')
        .insert([formData]);

      if (error) throw error;

      alert('Project created successfully!');
      setShowForm(false);
      setFormData({
        project_name: '',
        description: '',
        organization: '',
        contact_email: '',
        contact_phone: '',
        latitude: -1.3667,
        longitude: 38.01,
        area_hectares: 0,
        status: 'planning',
        start_date: new Date().toISOString().split('T')[0],
        target_trees: 0,
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg"
      >
        <Plus size={20} />
        Create New Project
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-800">New Reforestation Project</h3>
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
              Project Name *
            </label>
            <input
              type="text"
              required
              value={formData.project_name}
              onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="e.g., Kitui Green Belt Initiative"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Organization *
            </label>
            <input
              type="text"
              required
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Community group or NGO name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              value={formData.contact_email}
              onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="contact@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Contact Phone
            </label>
            <input
              type="tel"
              value={formData.contact_phone}
              onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="+254 700 000 000"
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
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Area (Hectares) *
            </label>
            <input
              type="number"
              step="0.1"
              required
              value={formData.area_hectares}
              onChange={(e) => setFormData({ ...formData, area_hectares: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="e.g., 25.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Target Trees *
            </label>
            <input
              type="number"
              required
              value={formData.target_trees}
              onChange={(e) => setFormData({ ...formData, target_trees: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="e.g., 5000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="Describe the project goals and approach..."
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Project'}
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
