import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { 
  Wallet, 
  CreditCard, 
  Building, 
  Smartphone,
  Plus,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const quickAmounts = [1000, 2000, 5000, 10000, 20000, 50000];

const recentTransactions = [
  {
    id: 1,
    type: 'credit',
    description: 'Wallet Funding via Card',
    amount: 5000,
    date: '2024-01-15 10:30 AM',
    status: 'completed',
  },
  {
    id: 2,
    type: 'debit',
    description: 'Airtime Purchase - MTN',
    amount: 1000,
    date: '2024-01-15 09:15 AM',
    status: 'completed',
  },
  {
    id: 3,
    type: 'debit',
    description: 'Data Bundle - Airtel',
    amount: 2500,
    date: '2024-01-14 8:45 PM',
    status: 'completed',
  },
  {
    id: 4,
    type: 'credit',
    description: 'Wallet Funding via Transfer',
    amount: 10000,
    date: '2024-01-14 2:30 PM',
    status: 'completed',
  },
];

export const WalletPage = () => {
  const { profile } = useAuth();
  const [fundingAmount, setFundingAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handleQuickAmount = (amount: number) => {
    setFundingAmount(amount.toString());
  };

  const handleFundWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(fundingAmount);
    if (!amount || amount < 100) {
      toast({
        title: "Invalid Amount",
        description: "Minimum funding amount is ₦100.",
        variant: "destructive",
      });
      return;
    }

    if (amount > 500000) {
      toast({
        title: "Amount Too High",
        description: "Maximum funding amount is ₦500,000.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulate payment process
    setTimeout(() => {
      toast({
        title: "Wallet Funded Successfully",
        description: `₦${amount.toLocaleString()} has been added to your wallet.`,
      });
      setFundingAmount('');
      setLoading(false);
    }, 3000);
  };

  const getTransactionIcon = (type: string) => {
    return type === 'credit' ? (
      <div className="p-2 bg-green-100 rounded-full">
        <ArrowDownLeft className="h-4 w-4 text-green-600" />
      </div>
    ) : (
      <div className="p-2 bg-red-100 rounded-full">
        <ArrowUpRight className="h-4 w-4 text-red-600" />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Wallet className="h-8 w-8 text-primary" />
          My Wallet
        </h1>
        <p className="text-muted-foreground">
          Manage your wallet balance and transaction history
        </p>
      </div>

      {/* Wallet Balance Card */}
      <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <CardContent className="p-8">
          <div className="text-center">
            <p className="text-primary-foreground/80 mb-2">Current Balance</p>
            <p className="text-4xl font-bold mb-4">
              ₦{profile?.wallet_balance?.toLocaleString() || '0.00'}
            </p>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="text-center">
                <p className="text-2xl font-semibold">127</p>
                <p className="text-sm text-primary-foreground/80">Total Transactions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold">98.5%</p>
                <p className="text-sm text-primary-foreground/80">Success Rate</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fund Wallet */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Fund Your Wallet</CardTitle>
            <CardDescription>
              Add money to your wallet to make purchases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="card" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Debit Card
                </TabsTrigger>
                <TabsTrigger value="transfer" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Bank Transfer
                </TabsTrigger>
              </TabsList>

              <TabsContent value="card" className="mt-6">
                <form onSubmit={handleFundWallet} className="space-y-6">
                  {/* Quick Amount Buttons */}
                  <div className="space-y-2">
                    <Label>Quick Amount</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {quickAmounts.map((amount) => (
                        <Button
                          key={amount}
                          type="button"
                          variant={fundingAmount === amount.toString() ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleQuickAmount(amount)}
                          disabled={loading}
                        >
                          ₦{amount.toLocaleString()}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="amount">Custom Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        ₦
                      </span>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="Enter amount"
                        value={fundingAmount}
                        onChange={(e) => setFundingAmount(e.target.value)}
                        disabled={loading}
                        className="pl-8"
                        min="100"
                        max="500000"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Minimum: ₦100 • Maximum: ₦500,000
                    </p>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading || !fundingAmount}>
                    {loading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Fund Wallet with Card
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="transfer" className="mt-6">
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Bank Transfer Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Account Name:</span>
                        <span className="font-medium">VT Recharge - {profile?.first_name} {profile?.last_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Account Number:</span>
                        <span className="font-medium">1234567890</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bank:</span>
                        <span className="font-medium">Providus Bank</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Transfer money to the account above and your wallet will be credited automatically within 5 minutes.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-xl font-bold">₦45,200</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Smartphone className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-xl font-bold">₦127,890</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <TrendingDown className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Transaction</p>
                  <p className="text-xl font-bold">₦1,850</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest wallet activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  {getTransactionIcon(transaction.type)}
                  <div>
                    <p className="font-medium text-foreground">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === 'credit' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {transaction.type === 'credit' ? '+' : '-'}₦{transaction.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {transaction.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};