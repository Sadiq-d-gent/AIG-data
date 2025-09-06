import { useState, useEffect } from 'react';
import { getAirtimeProducts, type AirtimeProduct } from '@/services/products';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { PurchaseModal } from '@/components/PurchaseModal';
import { Smartphone, Phone } from 'lucide-react';

export const AirtimeList = () => {
  const [airtimeProducts, setAirtimeProducts] = useState<AirtimeProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<AirtimeProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchAirtimeProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const products = await getAirtimeProducts();
        setAirtimeProducts(products);
      } catch (err: any) {
        console.error('Error fetching airtime products:', err);
        setError(err.message || 'Failed to fetch airtime products');
      } finally {
        setLoading(false);
      }
    };

    fetchAirtimeProducts();
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

  const handleBuyNow = (product: AirtimeProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handlePurchaseSuccess = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="sm" />
        <span className="ml-2 text-muted-foreground">Loading airtime products...</span>
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

  if (airtimeProducts.length === 0) {
    return (
      <div className="text-center py-8">
        <Smartphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No airtime products available.</p>
        <p className="text-sm text-muted-foreground mt-1">
          Check back later for available airtime products.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {airtimeProducts.map((product) => (
        <Card key={product.id} className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">
                {formatCurrency(product.denomination)}
              </CardTitle>
              <Badge className={getNetworkColor(product.network_provider)}>
                {product.network_provider.toUpperCase()}
              </Badge>
            </div>
            {product.bonus && product.bonus > 0 && (
              <CardDescription className="flex items-center gap-1 text-xs">
                <Phone className="h-3 w-3" />
                +{formatCurrency(product.bonus)} bonus
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="pt-0">
            <button 
              onClick={() => handleBuyNow(product)}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-2 rounded-md text-xs font-medium transition-colors duration-200"
            >
              Buy Now
            </button>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Purchase Modal */}
    {selectedProduct && (
      <PurchaseModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
        onSuccess={handlePurchaseSuccess}
        product={{
          id: selectedProduct.id,
          name: `${formatCurrency(selectedProduct.denomination)} Airtime`,
          price: selectedProduct.denomination,
          provider: selectedProduct.network_provider,
          serviceType: 'airtime',
          description: selectedProduct.bonus && selectedProduct.bonus > 0 
            ? `+ ${formatCurrency(selectedProduct.bonus)} bonus` 
            : undefined,
        }}
      />
    )}
  );
};
