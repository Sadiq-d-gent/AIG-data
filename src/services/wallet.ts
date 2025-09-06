import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

// Types based on the existing database schema
type TransactionRow = Database['public']['Tables']['transactions']['Row'];
type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];
type TransactionStatus = Database['public']['Enums']['transaction_status'];

// Custom Transaction type for wallet operations
export interface WalletTransaction {
  id: string;
  user_id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  status: 'pending' | 'success' | 'failed';
  created_at: string;
}

// Convert database transaction to wallet transaction
const convertToWalletTransaction = (dbTransaction: TransactionRow): WalletTransaction => {
  return {
    id: dbTransaction.id,
    user_id: dbTransaction.user_id,
    type: dbTransaction.amount > 0 ? 'credit' : 'debit',
    amount: Math.abs(dbTransaction.amount),
    description: dbTransaction.service_details?.description || 'Wallet transaction',
    status: dbTransaction.status === 'completed' ? 'success' : 
            dbTransaction.status === 'failed' ? 'failed' : 'pending',
    created_at: dbTransaction.created_at,
  };
};

/**
 * Fetches wallet balance from profiles table
 */
export const getWalletBalance = async (userId: string): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('wallet_balance')
      .eq('user_id', userId)
      .single();

    if (error) {
      // If profile doesn't exist (PGRST116), create one
      if (error.code === 'PGRST116') {
        console.warn('Profile not found, creating new profile for user:', userId);
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{ user_id: userId, wallet_balance: 0 }])
          .select('wallet_balance')
          .single();

        if (createError) {
          console.warn(`Error creating profile (${createError.code}): ${createError.message}`);
          return 0; // Return 0 instead of crashing
        }

        return newProfile.wallet_balance;
      }

      console.warn(`Error fetching wallet balance (${error.code}): ${error.message}`);
      return 0; // Return 0 instead of crashing
    }

    return data.wallet_balance;
  } catch (error: any) {
    console.warn('Unexpected error in getWalletBalance:', error);
    return 0; // Return 0 instead of crashing
  }
};

/**
 * Updates wallet balance by adding the specified amount
 */
export const updateWalletBalance = async (userId: string, amount: number): Promise<number> => {
  try {
    // First get current balance (this will create profile if needed)
    const currentBalance = await getWalletBalance(userId);
    const newBalance = currentBalance + amount;

    // Update the balance
    const { data, error } = await supabase
      .from('profiles')
      .update({ wallet_balance: newBalance })
      .eq('user_id', userId)
      .select('wallet_balance')
      .single();

    if (error) {
      console.warn(`Error updating wallet balance (${error.code}): ${error.message}`);
      return currentBalance; // Return current balance instead of crashing
    }

    return data.wallet_balance;
  } catch (error: any) {
    console.warn('Error in updateWalletBalance:', error);
    return 0; // Return 0 instead of crashing
  }
};

/**
 * Creates a wallet transaction record
 */
export const createTransaction = async (
  userId: string,
  type: 'credit' | 'debit',
  amount: number,
  description: string,
  status: 'pending' | 'success' | 'failed' = 'success'
): Promise<WalletTransaction | null> => {
  try {
    // Convert wallet transaction to database format
    const transactionAmount = type === 'credit' ? amount : -amount;
    const dbStatus: TransactionStatus = status === 'success' ? 'completed' : 
                                      status === 'failed' ? 'failed' : 'pending';

    const transactionData: TransactionInsert = {
      user_id: userId,
      amount: transactionAmount,
      service_type: 'airtime', // Using airtime as default since it's required
      recipient_phone: 'N/A', // Required field, using placeholder
      service_details: {
        description: description,
        type: type,
        wallet_transaction: true
      },
      status: dbStatus,
    };

    const { data, error } = await supabase
      .from('transactions')
      .insert(transactionData)
      .select('id, user_id, amount, service_type, recipient_phone, service_details, status, created_at, updated_at')
      .single();

    if (error) {
      console.warn(`Error creating transaction (${error.code}): ${error.message}`);
      return null; // Return null instead of crashing
    }

    return convertToWalletTransaction(data);
  } catch (error: any) {
    console.warn('Error in createTransaction:', error);
    return null; // Return null instead of crashing
  }
};

/**
 * Fetches all wallet transactions for a user
 */
export const getTransactions = async (userId: string): Promise<WalletTransaction[]> => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('id, user_id, amount, service_type, recipient_phone, service_details, status, created_at, updated_at')
      .eq('user_id', userId)
      .eq('service_details->wallet_transaction', true) // Filter for wallet transactions
      .order('created_at', { ascending: false });

    if (error) {
      console.warn(`Error fetching transactions (${error.code}): ${error.message}`);
      return []; // Return empty array instead of crashing
    }

    return data.map(convertToWalletTransaction);
  } catch (error: any) {
    console.warn('Error in getTransactions:', error);
    return []; // Return empty array instead of crashing
  }
};

/**
 * Helper function to get wallet transactions with pagination
 */
export const getTransactionsPaginated = async (
  userId: string,
  page: number = 1,
  limit: number = 10
): Promise<{ transactions: WalletTransaction[]; total: number; page: number; limit: number }> => {
  try {
    const offset = (page - 1) * limit;

    // Get total count
    const { count, error: countError } = await supabase
      .from('transactions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('service_details->wallet_transaction', true);

    if (countError) {
      console.warn(`Error getting transaction count (${countError.code}): ${countError.message}`);
      return {
        transactions: [],
        total: 0,
        page,
        limit,
      };
    }

    // Get paginated data
    const { data, error } = await supabase
      .from('transactions')
      .select('id, user_id, amount, service_type, recipient_phone, service_details, status, created_at, updated_at')
      .eq('user_id', userId)
      .eq('service_details->wallet_transaction', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.warn(`Error fetching paginated transactions (${error.code}): ${error.message}`);
      return {
        transactions: [],
        total: 0,
        page,
        limit,
      };
    }

    return {
      transactions: data.map(convertToWalletTransaction),
      total: count || 0,
      page,
      limit,
    };
  } catch (error: any) {
    console.warn('Error in getTransactionsPaginated:', error);
    return {
      transactions: [],
      total: 0,
      page,
      limit,
    };
  }
};

/**
 * Deducts amount from user's wallet balance
 * Throws error if insufficient balance
 */
export const deductBalance = async (userId: string, amount: number): Promise<number> => {
  try {
    // First get current balance
    const currentBalance = await getWalletBalance(userId);
    
    if (currentBalance < amount) {
      throw new Error(`Insufficient balance. Required: ₦${amount.toLocaleString()}, Available: ₦${currentBalance.toLocaleString()}`);
    }

    const newBalance = currentBalance - amount;

    // Update the balance
    const { data, error } = await supabase
      .from('profiles')
      .update({ wallet_balance: newBalance })
      .eq('user_id', userId)
      .select('wallet_balance')
      .single();

    if (error) {
      console.warn(`Error deducting balance (${error.code}): ${error.message}`);
      throw new Error(`Failed to deduct balance: ${error.message}`);
    }

    return data.wallet_balance;
  } catch (error: any) {
    console.warn('Error in deductBalance:', error);
    throw error;
  }
};
