import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

// User roles in Supabase
export type AppRole = 'OWNER' | 'MASTER' | 'COMMON';

// Function to sync current user role from Supabase to profiles table if needed,
// but primarily we use the profile data.
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, companies(*)')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
};

// High-level check for permissions (simplified for now)
export const hasPermission = (role: AppRole, module: string, action: string) => {
  if (role === 'OWNER') return true;
  if (role === 'MASTER') {
    // Master can do almost everything except some owner-only settings
    return true; 
  }
  // Common users have restricted access
  if (action === 'view') return true;
  return false;
};
