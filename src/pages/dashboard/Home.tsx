import { useAuth } from '@/context/AuthContext';
import { DataPlansList } from '@/components/products/DataPlansList';
import { AirtimeList } from '@/components/products/AirtimeList';
import { CablePackagesList } from '@/components/products/CablePackagesList';
import { ElectricityDiscosList } from '@/components/products/ElectricityDiscosList';
import { TransactionsList } from '@/components/TransactionsList';
import { Zap, Smartphone, Tv, Building2, History } from 'lucide-react';

export const Home = () => {
  const { user, profile } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getDisplayName = () => {
    if (profile?.first_name) {
      return profile.first_name;
    }
    return user?.email?.split('@')[0] || 'User';
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {getGreeting()}, {getDisplayName()}! 👋
        </h1>
        <p className="text-muted-foreground mt-2">
          Welcome to your VT Recharge dashboard
        </p>
      </div>

      {/* Data Plans Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Zap className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Data Plans</h2>
        </div>
        <p className="text-muted-foreground">
          Choose from our range of data plans for all networks
        </p>
        
        <DataPlansList />
      </div>

      {/* Airtime Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Smartphone className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Airtime</h2>
        </div>
        <p className="text-muted-foreground">
          Top up your phone with airtime for all networks
        </p>
        
        <AirtimeList />
      </div>

      {/* Cable Packages Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Tv className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Cable Packages</h2>
        </div>
        <p className="text-muted-foreground">
          Subscribe to cable TV packages from various providers
        </p>
        
        <CablePackagesList />
      </div>

      {/* Electricity Discos Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Building2 className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Electricity Bills</h2>
        </div>
        <p className="text-muted-foreground">
          Pay your electricity bills for all distribution companies
        </p>
        
        <ElectricityDiscosList />
      </div>

      {/* Recent Transactions Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <History className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Recent Transactions</h2>
        </div>
        <p className="text-muted-foreground">
          Your latest service purchases and transactions
        </p>
        
        <TransactionsList />
      </div>
    </div>
  );
};
