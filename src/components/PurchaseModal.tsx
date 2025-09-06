import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { deductBalance } from '@/services/wallet';
import { createTransaction, updateTransactionStatus, simulateApiCall } from '@/services/transactions';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { toast } from '@/hooks/use-toast';
import { CreditCard, Smartphone, Zap, Tv, Building2 } from 'lucide-react';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product: {
    id: string;
    name: string;
    price: number;
    provider: string;
    serviceType: 'airtime' | 'data' | 'cable_tv' | 'electricity';
    description?: string;
  };
}

export const PurchaseModal = ({ isOpen, onClose, onSuccess, product }: PurchaseModalProps) => {
  const { user } = useAuth();
  const [recipientPhone, setRecipientPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'airtime':
        return <Smartphone className="h-5 w-5" />;
      case 'data':
        return <Zap className="h-5 w-5" />;
      case 'cable_tv':
        return <Tv className="h-5 w-5" />;
      case 'electricity':
        return <Building2 className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const handlePurchase = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to make a purchase",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Deduct balance
      await deductBalance(user.id, product.price);

      // Step 2: Create transaction
      const transaction = await createTransaction({
        userId: user.id,
        serviceType: product.serviceType,
        productName: product.name,
        amount: product.price,
        provider: product.provider,
        recipientPhone: recipientPhone || undefined,
      });

      // Step 3: Simulate API call
      const apiResult = await simulateApiCall(transaction.id);

      // Step 4: Update transaction status
      const finalStatus = apiResult === 'success' ? 'completed' : 'failed';
      await updateTransactionStatus(transaction.id, finalStatus);

      // Step 5: Show success/failure toast
      if (apiResult === 'success') {
        toast({
          title: "Purchase Successful",
          description: `Your ${product.serviceType} purchase has been completed successfully.`,
        });
        onSuccess();
        onClose();
      } else {
        toast({
          title: "Purchase Failed",
          description: "Your purchase could not be completed. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Purchase error:', error);
      toast({
        title: "Purchase Error",
        description: error.message || "An error occurred during purchase. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const isPhoneRequired = product.serviceType === 'airtime' || product.serviceType === 'data';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getServiceIcon(product.serviceType)}
            Confirm Purchase
          </DialogTitle>
          <DialogDescription>
            Please review your purchase details before proceeding.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Product Details */}
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Product:</span>
              <span>{product.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Provider:</span>
              <span className="capitalize">{product.provider}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Amount:</span>
              <span className="text-lg font-bold text-primary">
                {formatCurrency(product.price)}
              </span>
            </div>
            {product.description && (
              <div className="flex justify-between items-start">
                <span className="font-medium">Description:</span>
                <span className="text-sm text-muted-foreground text-right">
                  {product.description}
                </span>
              </div>
            )}
          </div>

          {/* Recipient Phone (for airtime and data) */}
          {isPhoneRequired && (
            <div className="space-y-2">
              <Label htmlFor="recipientPhone">
                Recipient Phone Number
              </Label>
              <Input
                id="recipientPhone"
                type="tel"
                placeholder="08012345678"
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                disabled={isProcessing}
              />
              <p className="text-xs text-muted-foreground">
                Enter the phone number to receive the {product.serviceType}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePurchase}
            disabled={isProcessing || (isPhoneRequired && !recipientPhone.trim())}
            className="min-w-[100px]"
          >
            {isProcessing ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Processing...
              </>
            ) : (
              `Pay ${formatCurrency(product.price)}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
