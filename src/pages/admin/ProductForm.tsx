
import React from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '@/components/admin/Sidebar';
import ProductForm from '@/components/admin/ProductForm';

const AdminProductForm = () => {
  const { id } = useParams();
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-grow p-8 ml-64">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">
            {id ? "Editar Produto" : "Adicionar Produto"}
          </h1>
        </div>
        
        <ProductForm productId={id} />
      </main>
    </div>
  );
};

export default AdminProductForm;
