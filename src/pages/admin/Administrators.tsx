
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Sidebar from '@/components/admin/Sidebar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ProfileType } from '@/integrations/supabase/db-types';
import { PlusCircle, Loader2, Search, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';

const Administrators = () => {
  const [admins, setAdmins] = useState<ProfileType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'admin');

        if (error) {
          throw error;
        }

        setAdmins(data || []);
      } catch (error: any) {
        console.error('Error fetching administrators:', error);
        toast({
          title: "Erro ao carregar administradores",
          description: error.message || "Não foi possível carregar a lista de administradores.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, [toast]);

  const handleDeleteAdmin = async (adminId: string) => {
    if (window.confirm('Tem certeza que deseja remover este administrador?')) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ role: 'customer' })
          .eq('id', adminId);

        if (error) {
          throw error;
        }

        setAdmins(admins.filter(admin => admin.id !== adminId));
        toast({
          title: "Administrador removido",
          description: "O usuário não é mais um administrador.",
        });
      } catch (error: any) {
        console.error('Error removing administrator:', error);
        toast({
          title: "Erro ao remover administrador",
          description: error.message || "Não foi possível remover o administrador.",
          variant: "destructive"
        });
      }
    }
  };

  const filteredAdmins = admins.filter(admin => {
    const searchLower = searchQuery.toLowerCase();
    return (
      admin.first_name?.toLowerCase().includes(searchLower) ||
      admin.last_name?.toLowerCase().includes(searchLower) ||
      admin.email?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-grow p-8 ml-64">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Administradores</h1>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Buscar administradores..." 
                className="pl-9 w-full md:w-auto min-w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button asChild>
              <Link to="/admin/administradores/novo">
                <PlusCircle className="h-4 w-4 mr-2" />
                Novo Administrador
              </Link>
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 animate-spin text-carol-red" />
              <p className="mt-4 text-gray-500">Carregando administradores...</p>
            </div>
          </div>
        ) : filteredAdmins.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Nenhum administrador encontrado</h2>
            <p className="text-gray-500 mb-6">
              {searchQuery ? 'Nenhum administrador corresponde à sua pesquisa.' : 'Nenhum administrador cadastrado ainda.'}
            </p>
            <Button asChild>
              <Link to="/admin/administradores/novo">
                <PlusCircle className="h-4 w-4 mr-2" />
                Adicionar Administrador
              </Link>
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-6 py-4 text-sm font-medium text-gray-500">Nome</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-500">Email</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-500">Data de criação</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-500 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAdmins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">{admin.first_name} {admin.last_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {admin.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(admin.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteAdmin(admin.id)}
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

export default Administrators;
