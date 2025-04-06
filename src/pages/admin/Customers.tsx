
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProfileType } from '@/integrations/supabase/db-types';
import Sidebar from '@/components/admin/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, User, Mail, Phone, MapPin } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Customers = () => {
  const [customers, setCustomers] = useState<ProfileType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        console.log('Fetching customers...');
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'customer')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching customers:', error);
          throw error;
        }

        console.log('Customers data:', data);
        setCustomers(data || []);
      } catch (error) {
        console.error('Error loading customers:', error);
        toast({
          title: "Erro ao carregar clientes",
          description: "Não foi possível carregar a lista de clientes.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [toast]);
  
  const getFullName = (customer: ProfileType) => {
    const firstName = customer.first_name || '';
    const lastName = customer.last_name || '';
    return `${firstName} ${lastName}`.trim() || 'Cliente sem nome';
  };
  
  const filteredCustomers = customers.filter(customer => {
    const fullName = getFullName(customer).toLowerCase();
    const customerEmail = customer.email?.toLowerCase() || '';
    const searchLower = searchQuery.toLowerCase();
    
    return fullName.includes(searchLower) || 
           customerEmail.includes(searchLower) ||
           (customer.city || '').toLowerCase().includes(searchLower);
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-grow p-8 ml-64">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Clientes</h1>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Buscar clientes..." 
                className="pl-9 w-full md:w-auto min-w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-carol-red"></div>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <User className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Nenhum cliente encontrado</h2>
            <p className="text-gray-500">
              {searchQuery ? 'Nenhum cliente corresponde à sua pesquisa.' : 'Não há clientes cadastrados ainda.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.map((customer) => (
              <div key={customer.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-carol-red/10 flex items-center justify-center text-carol-red">
                      <User className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium">{getFullName(customer)}</h3>
                      <p className="text-sm text-gray-500">{customer.role || 'Cliente'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm">
                  {customer.email && (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{customer.email}</span>
                    </div>
                  )}
                  
                  {customer.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{customer.phone}</span>
                    </div>
                  )}
                  
                  {(customer.city || customer.state) && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <span>
                        {customer.city}
                        {customer.city && customer.state ? ', ' : ''}
                        {customer.state}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <Button 
                    variant="outline" 
                    className="w-full"
                  >
                    Ver detalhes
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Customers;
