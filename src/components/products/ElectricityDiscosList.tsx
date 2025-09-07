import { useState, useEffect } from 'react';
import { getElectricityDiscos, type Disco } from '@/services/products';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { PurchaseModal } from '@/components/PurchaseModal';
import { Zap, Building2, Hash } from 'lucide-react';

export const ElectricityDiscosList = () => {
  const [discos, setDiscos] = useState<Disco[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDisco, setSelectedDisco] = useState<Disco | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchDiscos = async () => {
      try {
        setLoading(true);
        setError(null);
        const discoList = await getElectricityDiscos();
        setDiscos(discoList);
      } catch (err: any) {
        console.error('Error fetching electricity discos:', err);
        setError(err.message || 'Failed to fetch electricity discos');
      } finally {
        setLoading(false);
      }
    };

    fetchDiscos();
  }, []);

  const getDiscoColor = (discoName: string) => {
    const nameLower = discoName.toLowerCase();
    if (nameLower.includes('ikeja') || nameLower.includes('eko')) {
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
    } else if (nameLower.includes('abuja') || nameLower.includes('aedc')) {
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
    } else if (nameLower.includes('kaduna') || nameLower.includes('kaedc')) {
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
    } else if (nameLower.includes('ph') || nameLower.includes('phed')) {
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
    }
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
  };

  const handleBuyNow = (disco: Disco) => {
    setSelectedDisco(disco);
    setIsModalOpen(true);
  };

  const handlePurchaseSuccess = () => {
    setIsModalOpen(false);
    setSelectedDisco(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="sm" />
        <span className="ml-2 text-muted-foreground">Loading electricity discos...</span>
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

  if (discos.length === 0) {
    return (
      <div className="text-center py-8">
        <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No electricity discos available.</p>
        <p className="text-sm text-muted-foreground mt-1">
          Check back later for available electricity discos.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {discos.map((disco) => (
          <Card key={disco.id} className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">{disco.disco_name}</CardTitle>
                <Badge className={getDiscoColor(disco.disco_name)}>
                  {disco.disco_code}
                </Badge>
              </div>
              <CardDescription className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Electricity Distribution Company
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Hash className="h-4 w-4" />
                <span>Code: {disco.disco_code}</span>
              </div>
              
              <div className="pt-2">
                <button 
                  onClick={() => handleBuyNow(disco)}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Pay Bills
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Purchase Modal */}
      {selectedDisco && (
        <PurchaseModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedDisco(null);
          }}
          onSuccess={handlePurchaseSuccess}
          product={{
            id: selectedDisco.id,
            name: selectedDisco.disco_name,
            price: 0, // Electricity bills don't have fixed prices
            provider: selectedDisco.disco_code,
            serviceType: 'electricity',
            description: `Electricity Distribution Company - Code: ${selectedDisco.disco_code}`,
          }}
        />
      )}
    </>
  );
};
