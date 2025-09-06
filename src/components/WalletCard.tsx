import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getWalletBalance } from '@/services/wallet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Wallet, Plus } from 'lucide-react';

export const WalletCard = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        setError(null);
        const walletBalance = await getWalletBalance(user.id);
        setBalance(walletBalance);
      } catch (err: any) {
        console.error('Error fetching wallet balance:', err);
        setError(err.message || 'Failed to fetch wallet balance');
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [user?.id]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="rounded-xl shadow-md bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Wallet className="h-5 w-5 text-primary" />
          Wallet Balance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner size="sm" />
            <span className="ml-2 text-muted-foreground">Loading balance...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-destructive text-sm">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        ) : (
          <>
            <div className="text-center">
              <p className="text-4xl font-bold text-foreground">
                {formatCurrency(balance || 0)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Available balance
              </p>
            </div>
            
            <Button 
              className="w-full" 
              size="sm"
              disabled
            >
              <Plus className="h-4 w-4 mr-2" />
              Fund Wallet
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};
