
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { ProfileType } from '@/integrations/supabase/db-types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: ProfileType | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any, data: any }>;
  signOut: () => Promise<void>;
  updateProfile: (data: any) => Promise<{ error: any }>;
  updateAccountSettings: (settings: any) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const setupAuth = async () => {
      try {
        // Set up auth listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, currentSession) => {
            console.log("Auth state changed:", event, currentSession?.user?.email);
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
            
            if (event === 'SIGNED_OUT') {
              setProfile(null);
            } else if (event === 'SIGNED_IN' && currentSession?.user) {
              // Fetch profile data on sign-in
              setTimeout(() => {
                fetchProfile(currentSession.user.id);
              }, 0);
            }
          }
        );
        
        // Then check for existing session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log("Current session:", currentSession?.user?.email);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          await fetchProfile(currentSession.user.id);
        }
        
        setIsLoading(false);
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Auth setup error:", error);
        setIsLoading(false);
      }
    };

    setupAuth();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user:", userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
      
      console.log("Profile data:", data);
      setProfile(data as ProfileType);
      
      // Handle redirect based on user role and current page
      if (data) {
        // If we're on login page, redirect to appropriate page
        if (location.pathname === '/login') {
          if (data.role === 'admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/');
          }
        }
      }
    } catch (err) {
      console.error('Error processing profile:', err);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting login with:", email);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error("Login error:", error);
        toast({
          title: "Erro ao fazer login",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }

      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo(a) de volta!"
      });
      
      // Fetch profile after successful login
      if (data.user) {
        await fetchProfile(data.user.id);
      }
      
      return { error: null };
    } catch (error) {
      console.error("Unexpected login error:", error);
      toast({
        title: "Erro ao fazer login",
        description: "Ocorreu um erro inesperado. Por favor, tente novamente.",
        variant: "destructive"
      });
      return { error };
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName
          }
        }
      });
      
      if (error) {
        toast({
          title: "Erro ao criar conta",
          description: error.message,
          variant: "destructive"
        });
        return { error, data: null };
      }

      if (data.user) {
        // Also update the profiles table to include the email and other data
        await supabase
          .from('profiles')
          .upsert({ 
            id: data.user.id,
            email: email,
            first_name: userData.firstName,
            last_name: userData.lastName,
            role: 'customer'
          });
      }

      toast({
        title: "Conta criada com sucesso",
        description: "Verifique seu e-mail para confirmar o cadastro."
      });
      
      return { error: null, data };
    } catch (error) {
      toast({
        title: "Erro ao criar conta",
        description: "Ocorreu um erro inesperado. Por favor, tente novamente.",
        variant: "destructive"
      });
      return { error, data: null };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    navigate('/login');
  };

  const updateProfile = async (data: Partial<ProfileType>) => {
    if (!user) return { error: new Error('Usuário não autenticado') };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);

      if (error) {
        toast({
          title: "Erro ao atualizar perfil",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }

      // Refresh profile data
      await fetchProfile(user.id);
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso."
      });
      
      return { error: null };
    } catch (error) {
      toast({
        title: "Erro ao atualizar perfil",
        description: "Ocorreu um erro inesperado. Por favor, tente novamente.",
        variant: "destructive"
      });
      return { error };
    }
  };

  const updateAccountSettings = async (settings: any) => {
    if (!user) return { error: new Error('Usuário não autenticado') };

    try {
      // Update user settings in the profile
      const { error } = await supabase
        .from('profiles')
        .update({
          preferences: settings
        })
        .eq('id', user.id);

      if (error) {
        toast({
          title: "Erro ao atualizar configurações",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }

      // Refresh profile data
      await fetchProfile(user.id);
      
      toast({
        title: "Configurações atualizadas",
        description: "Suas preferências foram salvas com sucesso."
      });
      
      return { error: null };
    } catch (error) {
      toast({
        title: "Erro ao atualizar configurações",
        description: "Ocorreu um erro inesperado. Por favor, tente novamente.",
        variant: "destructive"
      });
      return { error };
    }
  };

  const value = {
    user,
    session,
    profile,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    updateAccountSettings
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
