import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '../components/admin/SidebarProvider';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminHeader } from '../components/admin/AdminHeader';

const AdminDashboard = () => {
  return (
    <SidebarProvider>
      <div className="h-screen flex w-full bg-background/50 overflow-hidden">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          <AdminHeader />
          <main className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
