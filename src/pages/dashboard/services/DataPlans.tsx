import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { supabase } from '@/integrations/supabase/client';
import { Zap, Wifi } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface DataPlan {
  id: string;
  plan_name: string;
  network_provider: string;
  data_size: string;
  price: number;
  validity_days: number;
}

const networks = [
  { id: 'mtn', name: 'MTN', color: 'bg-yellow-500' },
  { id: 'airtel', name: 'Airtel', color: 'bg-red-500' },
  { id: 'glo', name: 'Glo', color: 'bg-green-500' },
  { id: '9mobile', name: '9mobile', color: 'bg-emerald-500' },
];

export const DataPlans = () => {
  const { profile } = useAuth();
  const [formData, setFormData] = useState({
    network: '',
    phone: '',
    plan: '',
  });
  const [dataPlans, setDataPlans] = useState<DataPlan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<DataPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [plansLoading, setPlansLoading] = useState(true);

  useEffect(() => {
    fetchDataPlans();
  }, []);

  useEffect(() => {
    if (formData.network) {
      const filtered = dataPlans.filter(plan => 
        plan.network_provider.toLowerCase() === formData.network.toLowerCase()
      );
      setFilteredPlans(filtered);
    } else {
      setFilteredPlans([]);
    }
  }, [formData.network, dataPlans]);

  const fetchDataPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('data_plans')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });

      if (error) {
        console.error('Error fetching data plans:', error);
        toast({
          title: "Error",
          description: "Failed to load data plans.",
          variant: "destructive",
        });
      } else {
        setDataPlans(data || []);
      }
    } catch (error) {
      console.error('Error fetching data plans:', error);
    } finally {
      setPlansLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (field === 'network') {
      setFormData({ ...formData, [field]: value, plan: '' });
    }
  };

  const getSelectedPlan = () => {
    return filteredPlans.find(plan => plan.id === formData.plan);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.network || !formData.phone || !formData.plan) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }

    const selectedPlan = getSelectedPlan();
    if (!selectedPlan) {
      toast({
        title: "Invalid Plan",
        description: "Please select a valid data plan.",
        variant: "destructive",
      });
      return;
    }

    if (profile && selectedPlan.price > profile.wallet_balance) {
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
        title: "Data Purchase Successful",
        description: `${selectedPlan.data_size} data sent to ${formData.phone}`,
      });
      setFormData({ network: '', phone: '', plan: '' });
      setLoading(false);
    }, 2000);
  };

  if (plansLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Wifi className="h-8 w-8 text-primary" />
          Buy Data
        </h1>
        <p className="text-muted-foreground">
          Purchase data bundles for all major networks
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Purchase Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Data Bundle Purchase</CardTitle>
            <CardDescription>
              Select a network and data plan to get started
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

              {/* Data Plan Selection */}
              {formData.network && (
                <div className="space-y-2">
                  <Label>Select Data Plan</Label>
                  {filteredPlans.length > 0 ? (
                    <div className="grid gap-3">
                      {filteredPlans.map((plan) => (
                        <button
                          key={plan.id}
                          type="button"
                          onClick={() => handleInputChange('plan', plan.id)}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            formData.plan === plan.id
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-primary/50'
                          }`}
                          disabled={loading}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{plan.data_size}</p>
                              <p className="text-sm text-muted-foreground">
                                Valid for {plan.validity_days} days
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-primary">₦{plan.price.toLocaleString()}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm p-4 border border-dashed rounded-lg text-center">
                      No data plans available for {networks.find(n => n.id === formData.network)?.name}
                    </p>
                  )}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading || !formData.network || !formData.phone || !formData.plan}
              >
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Purchase Data Plan
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

          {formData.plan && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Transaction Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(() => {
                  const selectedPlan = getSelectedPlan();
                  return selectedPlan ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Network:</span>
                        <span className="font-medium">
                          {networks.find(n => n.id === formData.network)?.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Phone:</span>
                        <span className="font-medium">{formData.phone || 'Not entered'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Data Size:</span>
                        <span className="font-medium">{selectedPlan.data_size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Validity:</span>
                        <span className="font-medium">{selectedPlan.validity_days} days</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-medium">Total:</span>
                        <span className="font-bold text-primary">₦{selectedPlan.price.toLocaleString()}</span>
                      </div>
                    </>
                  ) : null;
                })()}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};