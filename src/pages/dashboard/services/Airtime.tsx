import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Smartphone, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const networks = [
  { id: 'mtn', name: 'MTN', color: 'bg-yellow-500' },
  { id: 'airtel', name: 'Airtel', color: 'bg-red-500' },
  { id: 'glo', name: 'Glo', color: 'bg-green-500' },
  { id: '9mobile', name: '9mobile', color: 'bg-emerald-500' },
];

const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

export const Airtime = () => {
  const { profile } = useAuth();
  const [formData, setFormData] = useState({
    network: '',
    phone: '',
    amount: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleQuickAmount = (amount: number) => {
    setFormData({ ...formData, amount: amount.toString() });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.network || !formData.phone || !formData.amount) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(formData.amount);
    if (amount < 50) {
      toast({
        title: "Invalid Amount",
        description: "Minimum airtime amount is ₦50.",
        variant: "destructive",
      });
      return;
    }

    if (profile && amount > profile.wallet_balance) {
      toast({
        title: "Insufficient Balance",
        description: "Your wallet balance is insufficient for this transaction.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Airtime Purchase Successful",
        description: `₦${amount} airtime sent to ${formData.phone}`,
      });
      setFormData({ network: '', phone: '', amount: '' });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Smartphone className="h-8 w-8 text-primary" />
          Buy Airtime
        </h1>
        <p className="text-muted-foreground">
          Recharge your phone or someone else's phone instantly
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Purchase Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Airtime Recharge</CardTitle>
            <CardDescription>
              Fill in the details below to purchase airtime
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Network Selection */}
              <div className="space-y-2">
                <Label>Select Network</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {networks.map((network) => (
                    <button
                      key={network.id}
                      type="button"
                      onClick={() => handleInputChange('network', network.id)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.network === network.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                      disabled={loading}
                    >
                      <div className={`w-8 h-8 rounded-full ${network.color} mx-auto mb-2`} />
                      <p className="text-sm font-medium">{network.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="08012345678"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={loading}
                  maxLength={11}
                />
              </div>

              {/* Amount Selection */}
              <div className="space-y-4">
                <Label>Amount</Label>
                
                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {quickAmounts.map((amount) => (
                    <Button
                      key={amount}
                      type="button"
                      variant={formData.amount === amount.toString() ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleQuickAmount(amount)}
                      disabled={loading}
                    >
                      ₦{amount}
                    </Button>
                  ))}
                </div>

                {/* Custom Amount Input */}
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    ₦
                  </span>
                  <Input
                    type="number"
                    placeholder="Enter custom amount"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    disabled={loading}
                    className="pl-8"
                    min="50"
                    max="50000"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Minimum: ₦50 • Maximum: ₦50,000
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={loading || !formData.network || !formData.phone || !formData.amount}>
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Purchase Airtime
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Wallet & Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Wallet Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">
                  ₦{profile?.wallet_balance?.toLocaleString() || '0'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Available Balance
                </p>
                <Button variant="outline" size="sm" className="mt-3 w-full">
                  Fund Wallet
                </Button>
              </div>
            </CardContent>
          </Card>

          {formData.amount && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Transaction Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Network:</span>
                  <span className="font-medium">
                    {networks.find(n => n.id === formData.network)?.name || 'Not selected'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="font-medium">{formData.phone || 'Not entered'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-medium">₦{formData.amount}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-medium">Total:</span>
                  <span className="font-bold text-primary">₦{formData.amount}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};