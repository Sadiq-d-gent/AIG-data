import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

// Types based on the database schema
export interface DataPlan {
  id: string;
  plan_name: string;
  data_size: string;
  price: number;
  validity_days: number;
  network_provider: 'mtn' | 'glo' | 'airtel' | '9mobile';
  is_active: boolean | null;
  created_at: string;
}

export interface AirtimeProduct {
  id: string;
  network_provider: 'mtn' | 'glo' | 'airtel' | '9mobile';
  denomination: number;
  bonus?: number;
  is_active: boolean | null;
  created_at: string;
}

export interface CablePackage {
  id: string;
  package_name: string;
  description: string | null;
  price: number;
  validity_days: number;
  provider: string;
  is_active: boolean | null;
  created_at: string;
}

export interface Disco {
  id: string;
  disco_name: string;
  disco_code: string;
  is_active: boolean | null;
  created_at: string;
}

/**
 * Fetches data plans from Supabase database
 */
export const getDataPlans = async (): Promise<DataPlan[]> => {
  try {
    const { data, error } = await supabase
      .from('data_plans')
      .select('id, plan_name, data_size, price, validity_days, network_provider, is_active, created_at')
      .eq('is_active', true) // Only fetch active plans
      .order('price', { ascending: true });

    if (error) {
      console.error(`Error fetching data plans (${error.code}): ${error.message}`);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error in getDataPlans:', error);
    return [];
  }
};

/**
 * Placeholder function for future API integration
 * TODO: Replace getDataPlans() calls with getDataPlansFromApi() when ready to switch to Smeplug API
 */
export const getDataPlansFromApi = async (): Promise<DataPlan[]> => {
  try {
    // TODO: Implement Smeplug API integration
    // Example structure:
    // const response = await fetch('https://api.smeplug.com/data-plans', {
    //   headers: {
    //     'Authorization': `Bearer ${API_KEY}`,
    //     'Content-Type': 'application/json'
    //   }
    // });
    // const apiData = await response.json();
    // return transformApiDataToDataPlans(apiData);
    
    console.warn('getDataPlansFromApi() is not implemented yet. Using database fallback.');
    return getDataPlans(); // Fallback to database for now
  } catch (error) {
    console.error('Error fetching data plans from API:', error);
    return getDataPlans(); // Fallback to database on error
  }
};

/**
 * Fetches airtime products from Supabase database
 * TODO: Switch to VTpass/Clubkonnect/Reloadly API integration when ready
 */
export const getAirtimeProducts = async (): Promise<AirtimeProduct[]> => {
  try {
    // Check if airtime_products table exists, otherwise return mock data
    const { data, error } = await supabase
      .from('airtime_products')
      .select('id, network_provider, denomination, bonus, is_active, created_at')
      .eq('is_active', true)
      .order('denomination', { ascending: true });

    if (error) {
      console.warn(`Airtime products table not found (${error.code}): ${error.message}`);
      // Return mock data if table doesn't exist
      return getMockAirtimeProducts();
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error in getAirtimeProducts:', error);
    return getMockAirtimeProducts();
  }
};

/**
 * Fetches cable packages from Supabase database
 * TODO: Switch to VTpass/Clubkonnect API integration when ready
 */
export const getCablePackages = async (): Promise<CablePackage[]> => {
  try {
    const { data, error } = await supabase
      .from('cable_packages')
      .select('id, package_name, description, price, validity_days, provider, is_active, created_at')
      .eq('is_active', true)
      .order('price', { ascending: true });

    if (error) {
      console.error(`Error fetching cable packages (${error.code}): ${error.message}`);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error in getCablePackages:', error);
    return [];
  }
};

/**
 * Fetches electricity discos from Supabase database
 * TODO: Switch to VTpass/Clubkonnect API integration when ready
 */
export const getElectricityDiscos = async (): Promise<Disco[]> => {
  try {
    const { data, error } = await supabase
      .from('electricity_discos')
      .select('id, disco_name, disco_code, is_active, created_at')
      .eq('is_active', true)
      .order('disco_name', { ascending: true });

    if (error) {
      console.error(`Error fetching electricity discos (${error.code}): ${error.message}`);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error in getElectricityDiscos:', error);
    return [];
  }
};

/**
 * Mock airtime products data for when table doesn't exist
 */
const getMockAirtimeProducts = (): AirtimeProduct[] => {
  return [
    { id: '1', network_provider: 'mtn', denomination: 100, bonus: 0, is_active: true, created_at: new Date().toISOString() },
    { id: '2', network_provider: 'mtn', denomination: 200, bonus: 0, is_active: true, created_at: new Date().toISOString() },
    { id: '3', network_provider: 'mtn', denomination: 500, bonus: 0, is_active: true, created_at: new Date().toISOString() },
    { id: '4', network_provider: 'glo', denomination: 100, bonus: 0, is_active: true, created_at: new Date().toISOString() },
    { id: '5', network_provider: 'glo', denomination: 200, bonus: 0, is_active: true, created_at: new Date().toISOString() },
    { id: '6', network_provider: 'glo', denomination: 500, bonus: 0, is_active: true, created_at: new Date().toISOString() },
    { id: '7', network_provider: 'airtel', denomination: 100, bonus: 0, is_active: true, created_at: new Date().toISOString() },
    { id: '8', network_provider: 'airtel', denomination: 200, bonus: 0, is_active: true, created_at: new Date().toISOString() },
    { id: '9', network_provider: 'airtel', denomination: 500, bonus: 0, is_active: true, created_at: new Date().toISOString() },
    { id: '10', network_provider: '9mobile', denomination: 100, bonus: 0, is_active: true, created_at: new Date().toISOString() },
    { id: '11', network_provider: '9mobile', denomination: 200, bonus: 0, is_active: true, created_at: new Date().toISOString() },
    { id: '12', network_provider: '9mobile', denomination: 500, bonus: 0, is_active: true, created_at: new Date().toISOString() },
  ];
};

/**
 * Helper function to transform API data to DataPlan format
 * TODO: Implement when API integration is ready
 */
const transformApiDataToDataPlans = (apiData: any): DataPlan[] => {
  // TODO: Transform Smeplug API response to DataPlan format
  // This will depend on the actual API response structure
  return [];
};