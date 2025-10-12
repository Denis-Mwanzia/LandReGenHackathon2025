export type UserRole = 'admin' | 'manager' | 'volunteer' | 'viewer';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    role: UserRole
  ) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

// Role-based permissions
export const ROLE_PERMISSIONS = {
  admin: {
    canViewMap: true,
    canViewDashboard: true,
    canViewAIRecommendations: true,
    canCreateProjects: true,
    canRecordPlanting: true,
    canViewWeather: true,
    canViewVerification: true,
    canManageUsers: true,
    canViewAnalytics: true,
  },
  manager: {
    canViewMap: true,
    canViewDashboard: true,
    canViewAIRecommendations: true,
    canCreateProjects: true,
    canRecordPlanting: true,
    canViewWeather: true,
    canViewVerification: true,
    canManageUsers: false,
    canViewAnalytics: true,
  },
  volunteer: {
    canViewMap: true,
    canViewDashboard: true,
    canViewAIRecommendations: true,
    canCreateProjects: false,
    canRecordPlanting: true,
    canViewWeather: true,
    canViewVerification: false,
    canManageUsers: false,
    canViewAnalytics: false,
  },
  viewer: {
    canViewMap: true,
    canViewDashboard: true,
    canViewAIRecommendations: true,
    canCreateProjects: false,
    canRecordPlanting: false,
    canViewWeather: true,
    canViewVerification: false,
    canManageUsers: false,
    canViewAnalytics: false,
  },
} as const;

export const ROLE_DESCRIPTIONS = {
  admin: 'Full system access including user management and analytics',
  manager: 'Project management and team oversight capabilities',
  volunteer: 'Can record planting activities and view project data',
  viewer: 'Read-only access to maps, weather, and AI recommendations',
} as const;
