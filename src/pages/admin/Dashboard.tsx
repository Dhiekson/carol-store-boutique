
import React from 'react';
import AdminSidebar from '@/components/admin/Sidebar';
import DashboardMetrics from '@/components/admin/DashboardMetrics';
import RecentOrders from '@/components/admin/RecentOrders';

const AdminDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 h-full">
        <AdminSidebar />
      </div>
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <DashboardMetrics />
          <RecentOrders />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
