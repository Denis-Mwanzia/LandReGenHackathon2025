import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { User, LogOut, Settings, Mail, Calendar } from 'lucide-react';

type UserProfileProps = {
  onLogout: () => void;
};

export default function UserProfile({ onLogout }: UserProfileProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Error getting user:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 max-w-md mx-auto">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-slate-200 rounded-full mx-auto mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-3/4 mx-auto mb-2"></div>
          <div className="h-3 bg-slate-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const fullName = user.user_metadata?.full_name || 'User';
  const email = user.email || '';
  const createdAt = new Date(user.created_at).toLocaleDateString();

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="text-white" size={28} />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-1">{fullName}</h2>
        <p className="text-slate-600 text-sm">Community Member</p>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
          <Mail className="text-slate-500" size={18} />
          <div>
            <p className="text-sm font-medium text-slate-700">Email</p>
            <p className="text-sm text-slate-600">{email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
          <Calendar className="text-slate-500" size={18} />
          <div>
            <p className="text-sm font-medium text-slate-700">Member Since</p>
            <p className="text-sm text-slate-600">{createdAt}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <div>
            <p className="text-sm font-medium text-emerald-700">Status</p>
            <p className="text-sm text-emerald-600">Active Member</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button className="w-full bg-slate-100 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
          <Settings size={16} />
          Account Settings
        </button>

        <button
          onClick={handleLogout}
          className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all flex items-center justify-center gap-2"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
        <p className="text-sm text-emerald-700 text-center">
          Thank you for contributing to Kitui County's reforestation efforts! 🌳
        </p>
      </div>
    </div>
  );
}
