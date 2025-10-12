import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User, UserRole, AuthContextType } from '../types/auth';
import { toast } from 'react-hot-toast';

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
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await loadUserProfile(session.user.id);
      } else {
        setUser(null);
      }

      if (event === 'SIGNED_IN') {
        toast.success('Welcome to Kitui Reforest AI!');
      } else if (event === 'SIGNED_OUT') {
        toast.success('You have been signed out');
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data) {
        setUser(data as User);
      } else {
        // If no profile exists, create a default one
        const { data: authUser } = await supabase.auth.getUser();
        if (authUser.user) {
          const newProfile = {
            id: authUser.user.id,
            email: authUser.user.email!,
            full_name: authUser.user.user_metadata?.full_name || '',
            role: 'viewer' as UserRole,
          };

          const { error: insertError } = await supabase
            .from('user_profiles')
            .insert(newProfile);

          if (!insertError) {
            setUser(newProfile as User);
          }
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
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
      const { error } = await supabase.auth.signUp({
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

      // Create user profile
      const { data: authUser } = await supabase.auth.getUser();
      if (authUser.user) {
        const newProfile = {
          id: authUser.user.id,
          email: email,
          full_name: fullName,
          role: role,
        };

        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert(newProfile);

        if (profileError) {
          console.error('Error creating user profile:', profileError);
        }
      }

      toast.success(
        'Account created successfully! Please check your email to verify your account.'
      );
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out');
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
    } catch (error: any) {
      if (error.message?.includes('Google OAuth')) {
        toast.error(
          'Google OAuth is not configured. Please contact an administrator.'
        );
      } else {
        toast.error(error.message || 'Failed to sign in with Google');
      }
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
