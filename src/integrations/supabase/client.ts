
import { createClient } from '@supabase/supabase-js';
import type { Database } from './schema';

const SUPABASE_URL = "https://vridpeoniowzcszrhyxf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyaWRwZW9uaW93emNzenJoeXhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4OTU2MTIsImV4cCI6MjA1OTQ3MTYxMn0.yxfY43YSVv0-O6pxsgZrCU5foADP0D2tir_yFZrb1p8";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      storage: typeof window !== 'undefined' ? localStorage : undefined
    }
  }
);

// Add a helper function to create the admin user if it doesn't exist
export const ensureAdminUser = async () => {
  try {
    // First check if admin exists
    const { data: existingUser, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', 'admin@carolstore.com')
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error("Error checking admin user:", checkError);
      return;
    }

    // If admin doesn't exist, create it
    if (!existingUser) {
      console.log("Creating admin user...");
      
      // Create admin user in auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: 'admin@carolstore.com',
        password: 'Admin123@',
        options: {
          data: {
            first_name: 'Admin',
            last_name: 'User'
          }
        }
      });

      if (authError) {
        console.error("Failed to create admin auth user:", authError);
        return;
      }

      if (authData?.user) {
        // Update the profile to make it an admin
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            email: 'admin@carolstore.com',
            first_name: 'Admin',
            last_name: 'User',
            role: 'admin'
          })
          .eq('id', authData.user.id);

        if (profileError) {
          console.error("Failed to update admin profile:", profileError);
        } else {
          console.log("Admin user created successfully!");
        }
      }
    }
  } catch (err) {
    console.error("Error in ensureAdminUser:", err);
  }
};

// Run this once on the client side
if (typeof window !== 'undefined') {
  ensureAdminUser();
}
