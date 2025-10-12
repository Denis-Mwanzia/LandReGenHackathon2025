import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User, UserRole, AuthContextType } from '../types/auth';
import { toast } from 'react-hot-toast';
import {
  testSupabaseCORS,
  diagnoseCORSError,
  logCORSConfiguration,
} from '../lib/cors-utils';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if Supabase is properly configured
  useEffect(() => {
    const checkSupabaseConfig = async () => {
      // Log CORS configuration for debugging
      logCORSConfiguration();

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Supabase configuration missing!');
        setLoading(false);
        return false;
      }

      if (!supabaseUrl.includes('supabase.co')) {
        console.error('❌ Invalid Supabase URL format:', supabaseUrl);
        setLoading(false);
        return false;
      }

      // Test CORS connectivity
      const corsTest = await testSupabaseCORS();

      if (!corsTest.success) {
        console.error('❌ CORS test failed:', corsTest.error);

        // Diagnose the specific CORS issues
        const issues = diagnoseCORSError({ message: corsTest.error });
        console.error('🔍 Diagnosed issues:', issues);

        setLoading(false);
        return false;
      }

      return true;
    };

    checkSupabaseConfig();
  }, []);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;

        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          setLoading(false);
        }
      } catch (error: any) {
        console.error('Error getting initial session:', error);

        // Log CORS/security errors for debugging
        if (
          error.message?.includes('denied') ||
          error.name === 'SecurityError'
        ) {
          console.error('CORS/Security Error detected. Check:');
          console.error('1. Supabase URL is correct');
          console.error('2. Environment variables are loaded');
          console.error('3. CORS settings in Supabase dashboard');
          console.error('4. Current origin:', window.location.origin);
        }

        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          setUser(null);
          setLoading(false);
        }

        if (event === 'SIGNED_IN') {
          toast.success('Welcome to Kitui Reforest AI!');
        } else if (event === 'SIGNED_OUT') {
          toast.success('You have been signed out');
          setLoading(false);
        } else if (event === 'TOKEN_REFRESHED') {
          setLoading(false);
        }
      } catch (error: any) {
        console.error('Auth state change error:', error);
        // Log auth state change errors for debugging
        if (
          error.message?.includes('denied') ||
          error.name === 'SecurityError'
        ) {
          console.error('Auth state change CORS error:', error);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      // First, try to get the current auth user data
      const { data: authUser } = await supabase.auth.getUser();
      if (!authUser.user) {
        setLoading(false);
        return;
      }

      // Create a minimal profile from auth data
      const minimalProfile = {
        id: authUser.user.id,
        email: authUser.user.email!,
        full_name: authUser.user.user_metadata?.full_name || '',
        role: authUser.user.user_metadata?.role || ('viewer' as UserRole),
      };

      // Set user immediately to prevent hanging
      setUser(minimalProfile as User);
      setLoading(false);

      // Try to load full profile from database in background
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (!error && data) {
          setUser(data as User);
        } else if (error && error.code === 'PGRST116') {
          // Profile doesn't exist, try to create it
          const { error: insertError } = await supabase
            .from('user_profiles')
            .insert(minimalProfile);

          if (insertError) {
            console.error('Failed to create user profile:', insertError);
          }
        } else {
          console.error('Error loading user profile:', error);
        }
      } catch (dbError) {
        console.error('Database error (non-blocking):', dbError);
        // Don't update loading state here since we already set the user
      }
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // The auth state change listener will handle loading the user profile
    } catch (error: any) {
      console.error('Sign in error:', error);

      // Log CORS errors in sign-in for debugging
      if (error.message?.includes('denied') || error.name === 'SecurityError') {
        console.error('Sign-in CORS error:', error);
      }

      toast.error(error.message || 'Failed to sign in');
      setLoading(false);
      throw error;
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: UserRole
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });

      if (error) throw error;

      // The user profile will be created automatically by the database trigger
      // when the user confirms their email and the auth.users record is created

      if (data.user && !data.user.email_confirmed_at) {
        toast.success(
          'Account created successfully! Please check your email to verify your account.'
        );
      } else {
        toast.success('Account created successfully!');
      }
    } catch (error: any) {
      console.error('Sign up error:', error);

      // Log CORS errors in sign-up for debugging
      if (error.message?.includes('denied') || error.name === 'SecurityError') {
        console.error('Sign-up CORS error:', error);
      }

      toast.error(error.message || 'Failed to create account');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error('Sign out error:', error);

      // Log CORS errors in sign-out for debugging
      if (error.message?.includes('denied') || error.name === 'SecurityError') {
        console.error('Sign-out CORS error:', error);
      }

      toast.error(error.message || 'Failed to sign out');
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
