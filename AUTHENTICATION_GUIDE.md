# Authentication System Guide

## Overview

The Kitui Reforest AI application uses **Supabase Authentication** to provide secure user management with multiple sign-in options. This guide explains how authentication is implemented and how it operates.

## Authentication Architecture

### 1. **Supabase Auth Integration**

- **Provider**: Supabase Auth (built on PostgreSQL)
- **Client**: `@supabase/supabase-js` library
- **Configuration**: Environment variables for secure API access

### 2. **Authentication Methods**

- ✅ **Email/Password**: Traditional signup and login
- ✅ **Google OAuth**: Social login integration
- ✅ **Session Management**: Automatic token refresh
- ✅ **User Profiles**: Display user information and account management

## How Authentication Works

### 1. **Initial Setup**

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
```

### 2. **Authentication Flow**

#### **Sign Up Process**

1. User fills out registration form (name, email, password)
2. Supabase validates email format and password strength
3. Account created with user metadata (full_name)
4. Email verification sent (if configured)
5. User redirected to profile or login

#### **Sign In Process**

1. User enters email/password or clicks Google OAuth
2. Supabase validates credentials
3. Session token generated and stored
4. User redirected to main application
5. Authentication state updated throughout app

#### **Session Management**

1. App checks for existing session on load
2. Automatic token refresh when needed
3. Real-time auth state changes listened for
4. Automatic logout on token expiration

### 3. **Authentication Components**

#### **AuthModal** (`src/components/Auth/AuthModal.tsx`)

- **Purpose**: Unified authentication interface
- **Features**:
  - Modal overlay for login/signup
  - Switches between login, signup, and profile views
  - Handles authentication state changes
  - Mobile-responsive design

#### **LoginForm** (`src/components/Auth/LoginForm.tsx`)

- **Purpose**: User sign-in interface
- **Features**:
  - Email/password authentication
  - Google OAuth integration
  - Password visibility toggle
  - Form validation and error handling
  - Loading states and user feedback

#### **SignupForm** (`src/components/Auth/SignupForm.tsx`)

- **Purpose**: User registration interface
- **Features**:
  - Full name, email, password collection
  - Password confirmation validation
  - Google OAuth signup
  - Email verification flow
  - Client-side validation

#### **UserProfile** (`src/components/Auth/UserProfile.tsx`)

- **Purpose**: User account management
- **Features**:
  - Display user information
  - Account settings placeholder
  - Secure logout functionality
  - Member status display

## Authentication State Management

### 1. **App-Level State**

```typescript
// src/App.tsx
const [user, setUser] = useState<any>(null);
const [authModalOpen, setAuthModalOpen] = useState(false);

useEffect(() => {
  // Get initial session
  supabase.auth.getSession().then(({ data: { session } }) => {
    setUser(session?.user ?? null);
  });

  // Listen for auth changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      setUser(session?.user ?? null);
      if (event === 'SIGNED_IN') {
        toast.success('Welcome to Kitui Reforest AI!');
      }
    }
  );

  return () => subscription.unsubscribe();
}, []);
```

### 2. **Authentication Events**

- `SIGNED_IN`: User successfully authenticated
- `SIGNED_OUT`: User logged out
- `TOKEN_REFRESHED`: Session token renewed
- `USER_UPDATED`: User profile information changed

## User Experience Features

### 1. **Seamless Integration**

- **No Page Reloads**: Authentication happens in modals
- **Persistent Sessions**: Users stay logged in across browser sessions
- **Real-time Updates**: Auth state changes immediately reflect in UI
- **Mobile Optimized**: Touch-friendly authentication forms

### 2. **User Feedback**

- **Toast Notifications**: Success/error messages for all auth actions
- **Loading States**: Visual feedback during authentication processes
- **Error Handling**: Clear error messages for failed attempts
- **Form Validation**: Real-time validation feedback

### 3. **Accessibility**

- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Proper focus handling in modals
- **High Contrast**: Accessible color schemes

## Security Features

### 1. **Supabase Security**

- **Row Level Security (RLS)**: Database-level access control
- **JWT Tokens**: Secure session management
- **Email Verification**: Optional email confirmation
- **Password Policies**: Configurable password requirements

### 2. **Client-Side Security**

- **Environment Variables**: API keys stored securely
- **HTTPS Only**: All authentication over secure connections
- **Token Refresh**: Automatic session renewal
- **Secure Storage**: Tokens stored in secure browser storage

## Authentication Integration with App Features

### 1. **Project Management**

- **User Ownership**: Projects linked to authenticated users
- **Data Persistence**: User data saved to personal accounts
- **Collaboration**: Multiple users can view all projects (transparency)

### 2. **Planting Records**

- **User Attribution**: Planting activities linked to user accounts
- **Progress Tracking**: Personal planting history and statistics
- **Community Sharing**: Public visibility of all activities

### 3. **AI Features**

- **Personalized Recommendations**: AI suggestions based on user location/history
- **Chat History**: Persistent conversation history with Kitui AI
- **Verification Records**: AI analysis results saved to user account

## Environment Configuration

### Required Environment Variables

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Google OAuth (requires Supabase configuration)
# No additional env vars needed - configured in Supabase dashboard
```

### Supabase Dashboard Configuration

1. **Authentication Settings**:
   - Enable email/password authentication
   - Configure Google OAuth provider
   - Set up email templates
   - Configure redirect URLs

2. **Database Security**:
   - Enable RLS on all tables
   - Set up user policies
   - Configure public access for read-only data

## Troubleshooting

### Common Issues

1. **Google OAuth Not Working**:
   - Check Supabase Google provider configuration
   - Verify redirect URLs in Google Console
   - Ensure proper domain configuration

2. **Session Not Persisting**:
   - Check browser storage settings
   - Verify Supabase URL and keys
   - Check for JavaScript errors in console

3. **Email Verification Not Working**:
   - Configure email templates in Supabase
   - Check SMTP settings
   - Verify email provider configuration

### Error Handling

- **Network Errors**: Graceful fallback with retry options
- **Invalid Credentials**: Clear error messages
- **API Key Issues**: Helpful configuration guidance
- **Session Expired**: Automatic redirect to login

## Future Enhancements

### Planned Features

- **Role-Based Access**: Admin, moderator, and user roles
- **Organization Management**: Group accounts for NGOs
- **Two-Factor Authentication**: Additional security layer
- **Social Features**: User profiles and community interaction
- **Analytics Dashboard**: User activity and engagement metrics

## Best Practices

### For Developers

1. **Always check authentication state** before sensitive operations
2. **Use proper error handling** for all auth operations
3. **Implement loading states** for better UX
4. **Test authentication flows** on different devices
5. **Keep user data secure** and follow privacy best practices

### For Users

1. **Use strong passwords** for account security
2. **Verify email addresses** for account recovery
3. **Log out on shared devices** to protect privacy
4. **Report suspicious activity** to administrators
5. **Keep contact information updated** for important notifications

---

This authentication system provides a robust, secure, and user-friendly foundation for the Kitui Reforest AI platform, enabling users to create accounts, manage projects, and contribute to the community-driven reforestation efforts.
