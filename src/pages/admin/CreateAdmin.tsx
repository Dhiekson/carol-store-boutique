
import React from 'react';
import Sidebar from '@/components/admin/Sidebar';
import AdminCreationForm from '@/components/admin/AdminCreationForm';

const CreateAdmin = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-grow p-8 ml-64">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Gerenciar Administradores</h1>
          <p className="text-gray-500">
            Adicione ou remova administradores do sistema
          </p>
        </div>
        
        <div className="max-w-xl">
          <AdminCreationForm />
        </div>
      </main>
    </div>
  );
};

export default CreateAdmin;
