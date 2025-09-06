import { useState, useEffect } from 'react';
import { getDataPlans, type DataPlan } from '@/services/products';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { PurchaseModal } from '@/components/PurchaseModal';
import { Wifi, Calendar, Zap } from 'lucide-react';

export const DataPlansList = () => {
  const [dataPlans, setDataPlans] = useState<DataPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<DataPlan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchDataPlans = async () => {
      try {
        setLoading(true);
        setError(null);
        // TODO: Switch to getDataPlansFromApi() when API integration is ready
        const plans = await getDataPlans();
        setDataPlans(plans);
      } catch (err: any) {
        console.error('Error fetching data plans:', err);
        setError(err.message || 'Failed to fetch data plans');
      } finally {
        setLoading(false);
      }
    };

    fetchDataPlans();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getNetworkColor = (network: string) => {
    const colors = {
      mtn: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
      glo: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
      airtel: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
      '9mobile': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    };
    return colors[network as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleBuyNow = (plan: DataPlan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handlePurchaseSuccess = () => {
    // Refresh data plans or handle success
    // For now, we'll just close the modal
    setIsModalOpen(false);
    setSelectedPlan(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="sm" />
        <span className="ml-2 text-muted-foreground">Loading data plans...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive text-sm">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 text-sm text-primary hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (dataPlans.length === 0) {
    return (
      <div className="text-center py-8">
        <Wifi className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No data plans available.</p>
        <p className="text-sm text-muted-foreground mt-1">
          Check back later for available data plans.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {dataPlans.map((plan) => (
        <Card key={plan.id} className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">{plan.plan_name}</CardTitle>
              <Badge className={getNetworkColor(plan.network_provider)}>
                {plan.network_provider.toUpperCase()}
              </Badge>
            </div>
            <CardDescription className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              {plan.data_size}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-primary">
                {formatCurrency(plan.price)}
              </span>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {plan.validity_days} days
              </div>
            </div>
            
            <div className="pt-2">
              <button 
                onClick={() => handleBuyNow(plan)}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Buy Now
              </button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Purchase Modal */}
    {selectedPlan && (
      <PurchaseModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPlan(null);
        }}
        onSuccess={handlePurchaseSuccess}
        product={{
          id: selectedPlan.id,
          name: selectedPlan.plan_name,
          price: selectedPlan.price,
          provider: selectedPlan.network_provider,
          serviceType: 'data',
          description: `${selectedPlan.data_size} - ${selectedPlan.validity_days} days validity`,
        }}
      />
    )}
  );
};