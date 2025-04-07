
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const Login = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Create admin user if it doesn't exist
    const ensureAdminExists = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', 'admin@carolstore.com')
          .maybeSingle();
        
        if (error) {
          console.error("Error checking for admin:", error);
        }
        
        // If admin doesn't exist in profiles, create it
        if (!data) {
          console.log("Admin not found, creating admin account...");
          
          // Create admin user
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: 'admin@carolstore.com',
            password: 'Admin123@',
            options: {
              data: {
                first_name: 'Admin',
                last_name: 'User',
                role: 'admin'
              }
            }
          });
          
          if (authError) {
            console.error("Error creating admin auth:", authError);
            return;
          }
          
          if (authData.user) {
            // Create admin profile
            const { error: profileError } = await supabase
              .from('profiles')
              .upsert({
                id: authData.user.id,
                email: 'admin@carolstore.com',
                first_name: 'Admin',
                last_name: 'User',
                role: 'admin'
              });
              
            if (profileError) {
              console.error("Error creating admin profile:", profileError);
            } else {
              console.log("Admin account created successfully");
              toast({
                title: "Admin criado com sucesso",
                description: "Use admin@carolstore.com / Admin123@ para fazer login como administrador"
              });
            }
          }
        }
      } catch (err) {
        console.error("Error in ensureAdminExists:", err);
      }
    };
    
    ensureAdminExists();
  }, [toast]);
  
  useEffect(() => {
    // If user is logged in, redirect based on role
    if (user && profile) {
      if (profile.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [user, profile, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 z-0">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <LoginForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
