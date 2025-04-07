
import React from 'react';
import AdminSidebar from '@/components/admin/Sidebar';
import DashboardMetrics from '@/components/admin/DashboardMetrics';
import RecentOrders from '@/components/admin/RecentOrders';
import { useAuth } from '@/contexts/AuthContext';

const AdminDashboard = () => {
  const { profile } = useAuth();
  
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 h-full">
        <AdminSidebar />
      </div>
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">Painel Administrativo</h1>
            {profile && (
              <div className="text-right">
                <p className="text-sm text-gray-500">Bem-vindo(a),</p>
                <p className="font-medium">{profile.first_name} {profile.last_name}</p>
              </div>
            )}
          </div>
          <DashboardMetrics />
          <RecentOrders />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
