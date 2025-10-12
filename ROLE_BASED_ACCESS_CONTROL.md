# Role-Based Access Control (RBAC) Implementation

## 🎯 **OVERVIEW**

The Kitui Reforest AI platform now implements a comprehensive role-based access control system that ensures users only have access to features appropriate for their role level. Only the **Home** page is accessible to all users (authenticated or not), while all other features require authentication and appropriate role permissions.

## 🔐 **USER ROLES & PERMISSIONS**

### **1. Viewer** (Default Role)

- **Access**: Read-only access to most features
- **Can View**:
  - ✅ Interactive Map
  - ✅ Dashboard (analytics)
  - ✅ AI Recommendations
  - ✅ Climate Insights (weather)
- **Cannot Access**:
  - ❌ Project Creation
  - ❌ Planting Record Entry
  - ❌ AI Image Verification
- **Use Case**: General public, researchers, stakeholders

### **2. Volunteer**

- **Access**: Can record planting activities
- **Can View**: All Viewer permissions +
- **Can Create**:
  - ✅ Planting Records
- **Cannot Access**:
  - ❌ Project Creation
  - ❌ AI Image Verification
- **Use Case**: Community volunteers, field workers

### **3. Manager**

- **Access**: Project management and team oversight
- **Can View**: All Volunteer permissions +
- **Can Create**:
  - ✅ Reforestation Projects
  - ✅ Planting Records
- **Can Access**:
  - ✅ AI Image Verification
- **Use Case**: Project coordinators, NGO managers

### **4. Admin**

- **Access**: Full system access
- **Can View**: All features
- **Can Create**: All content types
- **Can Access**: All features including user management
- **Use Case**: System administrators, organization leaders

## 🏗️ **TECHNICAL IMPLEMENTATION**

### **1. Authentication Context**

```typescript
// src/contexts/AuthContext.tsx
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Handles authentication state and user profile loading
  // Automatically creates user profiles with default 'viewer' role
}
```

### **2. Role Permissions Matrix**

```typescript
// src/types/auth.ts
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
};
```

### **3. Role Guards**

```typescript
// src/components/guards/RoleGuard.tsx
export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  permission,
  fallback,
  requireAuth = true,
}) => {
  const { user, loading } = useAuth();

  // Shows authentication required message if not logged in
  // Shows insufficient permissions message if user lacks permission
  // Renders children if user has appropriate permissions
};
```

### **4. Navigation Filtering**

```typescript
// src/App.tsx
const getVisibleTabs = () => {
  const allTabs = [
    { id: 'home', label: 'Home', icon: Home, public: true },
    { id: 'map', label: 'Interactive Map', icon: MapIcon, permission: 'canViewMap' },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, permission: 'canViewDashboard' },
    // ... other tabs
  ];

  // If not authenticated, only show public tabs (Home)
  if (!user) {
    return allTabs.filter(tab => tab.public);
  }

  // Filter tabs based on user role permissions
  return allTabs.filter(tab => 
    tab.public || (tab.permission && ROLE_PERMISSIONS[user.role]?.[tab.permission])
  );
};
```

## 🗄️ **DATABASE SCHEMA**

### **User Profiles Table**

```sql
-- supabase/migrations/20250110000000_create_user_profiles.sql
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'manager', 'volunteer', 'viewer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **Row Level Security (RLS)**

- **Users can view their own profile**
- **Users can update their own profile (except role)**
- **Admins can view and update all profiles**
- **Automatic profile creation on user signup**

### **Project & Planting Record Access**

- **All authenticated users can view projects and planting records**
- **Only managers/admins can create projects**
- **Volunteers and above can create planting records**
- **Users can update their own records, admins can update any**

## 🎨 **USER EXPERIENCE**

### **1. Registration Flow**

1. User visits the platform
2. Clicks "Sign Up" and selects their role
3. Fills out registration form with role selection
4. Account created with selected role (defaults to 'viewer')
5. User profile automatically created in database

### **2. Navigation Experience**

- **Unauthenticated Users**: Only see "Home" tab
- **Authenticated Users**: See tabs based on their role permissions
- **Role Display**: User role shown in profile modal

### **3. Feature Access**

- **Guarded Components**: Show appropriate access denied messages
- **Clear Messaging**: Users understand why they can't access features
- **Role Information**: Users can see their current role and permissions

### **4. Visual Indicators**

```typescript
// Role displayed in user profile
<div className="flex items-center justify-center gap-2 mb-2">
  <Shield className="text-emerald-600" size={16} />
  <span className="text-emerald-700 font-semibold text-sm capitalize">{role}</span>
</div>
```

## 🔧 **SETUP & CONFIGURATION**

### **1. Environment Variables**

No additional environment variables required - uses existing Supabase configuration.

### **2. Database Migration**

```bash
# Run the migration to create user profiles table
supabase db push
```

### **3. Role Assignment**

- **Default Role**: All new users get 'viewer' role
- **Manual Assignment**: Admins can update user roles in database
- **Future Enhancement**: Admin panel for role management

## 🚀 **FEATURE ACCESS MATRIX**

| Feature | Public | Viewer | Volunteer | Manager | Admin |
|---------|--------|--------|-----------|---------|-------|
| Home | ✅ | ✅ | ✅ | ✅ | ✅ |
| Interactive Map | ❌ | ✅ | ✅ | ✅ | ✅ |
| Dashboard | ❌ | ✅ | ✅ | ✅ | ✅ |
| AI Recommendations | ❌ | ✅ | ✅ | ✅ | ✅ |
| Climate Insights | ❌ | ✅ | ✅ | ✅ | ✅ |
| New Project | ❌ | ❌ | ❌ | ✅ | ✅ |
| Record Planting | ❌ | ❌ | ✅ | ✅ | ✅ |
| AI Verification | ❌ | ❌ | ❌ | ✅ | ✅ |
| User Management | ❌ | ❌ | ❌ | ❌ | ✅ |

## 🛡️ **SECURITY FEATURES**

### **1. Client-Side Protection**

- **Role Guards**: Components wrapped with permission checks
- **Navigation Filtering**: Tabs hidden based on permissions
- **Context-Based Auth**: Centralized authentication state

### **2. Server-Side Protection**

- **Row Level Security**: Database-level access control
- **JWT Tokens**: Secure session management
- **User Profile Validation**: Role validation on all operations

### **3. Access Denied Handling**

- **Graceful Degradation**: Clear messages for denied access
- **User Guidance**: Instructions on how to gain access
- **Role Information**: Users understand their current permissions

## 🎯 **BENEFITS**

### **1. Security**

- **Principle of Least Privilege**: Users only get necessary access
- **Data Protection**: Sensitive features protected by authentication
- **Audit Trail**: All actions tied to authenticated users

### **2. User Experience**

- **Clean Interface**: Users only see relevant features
- **Clear Permissions**: Users understand their access level
- **Scalable**: Easy to add new roles and permissions

### **3. Organization**

- **Structured Access**: Clear hierarchy of user capabilities
- **Community Building**: Different user types can participate appropriately
- **Professional Use**: Suitable for organizational deployment

## 🔮 **FUTURE ENHANCEMENTS**

### **1. Admin Panel**

- **User Management**: Create, update, delete users
- **Role Assignment**: Change user roles through UI
- **Permission Management**: Customize permissions per role

### **2. Advanced Features**

- **Organization Management**: Multi-tenant support
- **Team Management**: Group users by organization
- **Custom Roles**: Create organization-specific roles

### **3. Analytics**

- **User Activity Tracking**: Monitor feature usage by role
- **Permission Analytics**: Understand access patterns
- **Security Monitoring**: Track authentication events

## ✅ **IMPLEMENTATION COMPLETE**

The role-based access control system is now fully implemented and provides:

- ✅ **Four distinct user roles** with appropriate permissions
- ✅ **Secure authentication** with Supabase integration
- ✅ **Protected features** with role-based guards
- ✅ **Clean user interface** showing only accessible features
- ✅ **Database security** with Row Level Security policies
- ✅ **Comprehensive documentation** for maintenance and extension

**The platform now provides a secure, scalable, and user-friendly experience that respects user roles while maintaining the collaborative spirit of the reforestation community!** 🌱🔐
