import { Outlet } from 'react-router-dom';
import { DashboardSidebar } from './DashboardSidebar';
import { MobileNavigation } from './MobileNavigation';
import { SidebarProvider } from '@/components/ui/sidebar';

export const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Desktop Sidebar */}
        <DashboardSidebar />
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col pb-16 md:pb-0">
          <div className="flex-1 p-4 md:p-6">
            <Outlet />
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileNavigation />
      </div>
    </SidebarProvider>
  );
};