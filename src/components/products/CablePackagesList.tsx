import { useState, useEffect } from 'react';
import { getCablePackages, type CablePackage } from '@/services/products';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { PurchaseModal } from '@/components/PurchaseModal';
import { Tv, Calendar, Star } from 'lucide-react';

export const CablePackagesList = () => {
  const [cablePackages, setCablePackages] = useState<CablePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<CablePackage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCablePackages = async () => {
      try {
        setLoading(true);
        setError(null);
        const packages = await getCablePackages();
        setCablePackages(packages);
      } catch (err: any) {
        console.error('Error fetching cable packages:', err);
        setError(err.message || 'Failed to fetch cable packages');
      } finally {
        setLoading(false);
      }
    };

    fetchCablePackages();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getProviderColor = (provider: string) => {
    const providerLower = provider.toLowerCase();
    if (providerLower.includes('dstv')) {
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
    } else if (providerLower.includes('gotv')) {
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
    } else if (providerLower.includes('startimes')) {
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
    }
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
  };

  const handleBuyNow = (pkg: CablePackage) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  const handlePurchaseSuccess = () => {
    setIsModalOpen(false);
    setSelectedPackage(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="sm" />
        <span className="ml-2 text-muted-foreground">Loading cable packages...</span>
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

  if (cablePackages.length === 0) {
    return (
      <div className="text-center py-8">
        <Tv className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No cable packages available.</p>
        <p className="text-sm text-muted-foreground mt-1">
          Check back later for available cable packages.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {cablePackages.map((pkg) => (
        <Card key={pkg.id} className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">{pkg.package_name}</CardTitle>
              <Badge className={getProviderColor(pkg.provider)}>
                {pkg.provider}
              </Badge>
            </div>
            {pkg.description && (
              <CardDescription className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                {pkg.description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-primary">
                {formatCurrency(pkg.price)}
              </span>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {pkg.validity_days} days
              </div>
            </div>
            
            <div className="pt-2">
              <button 
                onClick={() => handleBuyNow(pkg)}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Subscribe Now
              </button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Purchase Modal */}
    {selectedPackage && (
      <PurchaseModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPackage(null);
        }}
        onSuccess={handlePurchaseSuccess}
        product={{
          id: selectedPackage.id,
          name: selectedPackage.package_name,
          price: selectedPackage.price,
          provider: selectedPackage.provider,
          serviceType: 'cable_tv',
          description: selectedPackage.description || `${selectedPackage.validity_days} days validity`,
        }}
      />
    )}
  );
};