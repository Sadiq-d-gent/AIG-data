import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

// Types based on the database schema
export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  service_type: 'airtime' | 'data' | 'cable_tv' | 'electricity';
  network_provider: 'mtn' | 'glo' | 'airtel' | '9mobile' | null;
  recipient_phone: string;
  reference_id: string | null;
  service_details: any | null;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface CreateTransactionData {
  userId: string;
  serviceType: 'airtime' | 'data' | 'cable_tv' | 'electricity';
  productName: string;
  amount: number;
  provider: string;
  recipientPhone?: string;
}

/**
 * Creates a new transaction in the database
 */
export const createTransaction = async (data: CreateTransactionData): Promise<Transaction> => {
  try {
    const transactionData = {
      user_id: data.userId,
      amount: data.amount,
      service_type: data.serviceType,
      network_provider: data.serviceType === 'airtime' || data.serviceType === 'data' 
        ? (data.provider as 'mtn' | 'glo' | 'airtel' | '9mobile') 
        : null,
      recipient_phone: data.recipientPhone || 'N/A',
      reference_id: null,
      service_details: {
        product_name: data.productName,
        provider: data.provider,
        service_type: data.serviceType,
      },
      status: 'pending' as const,
    };

    const { data: newTransaction, error } = await supabase
      .from('transactions')
      .insert(transactionData)
      .select('id, user_id, amount, service_type, network_provider, recipient_phone, reference_id, service_details, status, created_at, updated_at')
      .single();

    if (error) {
      console.error(`Error creating transaction (${error.code}): ${error.message}`);
      throw new Error(`Failed to create transaction: ${error.message}`);
    }

    return newTransaction;
  } catch (error: any) {
    console.error('Unexpected error in createTransaction:', error);
    throw error;
  }
};

/**
 * Updates the status of an existing transaction
 */
export const updateTransactionStatus = async (id: string, status: 'pending' | 'completed' | 'failed' | 'cancelled'): Promise<Transaction> => {
  try {
    const { data: updatedTransaction, error } = await supabase
      .from('transactions')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('id, user_id, amount, service_type, network_provider, recipient_phone, reference_id, service_details, status, created_at, updated_at')
      .single();

    if (error) {
      console.error(`Error updating transaction status (${error.code}): ${error.message}`);
      throw new Error(`Failed to update transaction status: ${error.message}`);
    }

    return updatedTransaction;
  } catch (error: any) {
    console.error('Unexpected error in updateTransactionStatus:', error);
    throw error;
  }
};

/**
 * Fetches all transactions for a user
 */
export const getTransactions = async (userId: string): Promise<Transaction[]> => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('id, user_id, amount, service_type, network_provider, recipient_phone, reference_id, service_details, status, created_at, updated_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error fetching transactions (${error.code}): ${error.message}`);
      return [];
    }

    return data || [];
  } catch (error: any) {
    console.error('Unexpected error in getTransactions:', error);
    return [];
  }
};

/**
 * Simulates an API call for service purchase
 * TODO: Replace with actual API integration (VTpass, Clubkonnect, Reloadly)
 */
export const simulateApiCall = async (transactionId: string): Promise<'success' | 'failed'> => {
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      // Randomly return success or failure for simulation
      const isSuccess = Math.random() > 0.2; // 80% success rate
      resolve(isSuccess ? 'success' : 'failed');
    }, 2000); // 2 second delay
  });
};
