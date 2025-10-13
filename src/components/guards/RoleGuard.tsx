import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ROLE_PERMISSIONS } from '../../types/auth';
import { Lock, AlertTriangle } from 'lucide-react';

interface RoleGuardProps {
  children: React.ReactNode;
  permission: keyof typeof ROLE_PERMISSIONS.admin;
  fallback?: React.ReactNode;
  requireAuth?: boolean;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  permission,
  fallback,
  requireAuth = true,
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  // If authentication is required but user is not logged in
  if (requireAuth && !user) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="text-red-500" size={40} />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">
          Authentication Required
        </h3>
        <p className="text-slate-600 mb-6 max-w-md mx-auto">
          You need to sign in to access this feature. Please create an account
          or sign in to continue.
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-md mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="text-amber-600" size={16} />
            <span className="text-sm font-medium text-amber-700">
              Sign In Required
            </span>
          </div>
          <p className="text-sm text-amber-600">
            This feature requires authentication. Please sign in to your
            account.
          </p>
        </div>
      </div>
    );
  }

  // If user is logged in but doesn't have permission
  if (user && !ROLE_PERMISSIONS[user.role][permission]) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="text-amber-500" size={40} />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">
          Access Restricted
        </h3>
        <p className="text-slate-600 mb-6 max-w-md mx-auto">
          You don't have permission to access this feature. Contact an
          administrator if you believe this is an error.
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-md mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="text-amber-600" size={16} />
            <span className="text-sm font-medium text-amber-700">
              Insufficient Permissions
            </span>
          </div>
          <p className="text-sm text-amber-600">
            Your role ({user.role}) doesn't have access to this feature.
          </p>
        </div>
      </div>
    );
  }

  // User has permission, render children
  return <>{children}</>;
};

// Convenience components for common permissions
export const MapGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <RoleGuard permission="canViewMap">{children}</RoleGuard>;

export const DashboardGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <RoleGuard permission="canViewDashboard">{children}</RoleGuard>;

export const AIRecommendationsGuard: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <RoleGuard permission="canViewAIRecommendations">{children}</RoleGuard>
);

export const ProjectCreationGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <RoleGuard permission="canCreateProjects">{children}</RoleGuard>;

export const PlantingGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <RoleGuard permission="canRecordPlanting">{children}</RoleGuard>;

export const WeatherGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <RoleGuard permission="canViewWeather">{children}</RoleGuard>;

export const ChatGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <RoleGuard permission="canViewChat">{children}</RoleGuard>;

export const VerificationGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <RoleGuard permission="canViewVerification">{children}</RoleGuard>;

export const AnalyticsGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <RoleGuard permission="canViewAnalytics">{children}</RoleGuard>;
