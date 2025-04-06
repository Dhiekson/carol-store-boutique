
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ProductType } from '@/integrations/supabase/db-types';
import Sidebar from '@/components/admin/Sidebar';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const AdminProducts = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Erro ao carregar produtos",
          description: "Não foi possível carregar a lista de produtos.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);

        if (error) {
          throw error;
        }

        setProducts(products.filter(product => product.id !== id));
        toast({
          title: "Produto excluído",
          description: "O produto foi excluído com sucesso."
        });
      } catch (error) {
        console.error('Error deleting product:', error);
        toast({
          title: "Erro ao excluir produto",
          description: "Não foi possível excluir o produto.",
          variant: "destructive"
        });
      }
    }
  };
  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-grow p-8 ml-64">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Gerenciar Produtos</h1>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Buscar produtos..." 
                className="pl-9 w-full md:w-auto min-w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button asChild>
              <Link to="/admin/produtos/novo">
                <PlusCircle className="h-4 w-4 mr-2" />
                Novo Produto
              </Link>
            </Button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Nenhum produto encontrado</h2>
            <p className="text-gray-500 mb-6">
              {searchQuery ? 'Nenhum produto corresponde à sua pesquisa.' : 'Nenhum produto cadastrado ainda.'}
            </p>
            <Button asChild>
              <Link to="/admin/produtos/novo">
                <PlusCircle className="h-4 w-4 mr-2" />
                Adicionar Produto
              </Link>
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-6 py-4 text-sm font-medium text-gray-500">Produto</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-500">Categoria</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-500">Preço</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-500">Estoque</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-500 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded overflow-hidden bg-gray-100 mr-3">
                            {product.image_url ? (
                              <img 
                                src={product.image_url} 
                                alt={product.name} 
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full bg-gray-200"></div>
                            )}
                          </div>
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium">R$ {product.price.toFixed(2).replace('.', ',')}</div>
                          {product.discount_price && (
                            <div className="text-sm text-green-600">
                              R$ {product.discount_price.toFixed(2).replace('.', ',')}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`font-medium ${product.stock < 5 ? 'text-red-600' : ''}`}>
                          {product.stock}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            asChild
                          >
                            <Link to={`/admin/produtos/${product.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminProducts;
