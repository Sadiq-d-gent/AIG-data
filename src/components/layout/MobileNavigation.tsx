import { NavLink, useLocation } from 'react-router-dom';
import { Home, User, Settings, Wallet, Smartphone } from 'lucide-react';

const mobileNavItems = [
  { title: 'Home', url: '/dashboard', icon: Home },
  { title: 'Services', url: '/dashboard/airtime', icon: Smartphone },
  { title: 'Wallet', url: '/dashboard/wallet', icon: Wallet },
  { title: 'Profile', url: '/dashboard/profile', icon: User },
  { title: 'Settings', url: '/dashboard/settings', icon: Settings },
];

export const MobileNavigation = () => {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around py-2">
        {mobileNavItems.map((item) => {
          const isActive = location.pathname === item.url || 
            (item.url === '/dashboard/airtime' && 
             ['/dashboard/data', '/dashboard/cable'].includes(location.pathname));
          
          return (
            <NavLink
              key={item.title}
              to={item.url}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{item.title}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};