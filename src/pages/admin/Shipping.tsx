
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Sidebar from '@/components/admin/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Plus, PlusCircle, Clock, Ban } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface ShippingMethod {
  id: string;
  name: string;
  description: string | null;
  base_price: number;
  price_per_kg: number;
  estimated_days: string;
  active: boolean | null;
}

const Shipping = () => {
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchShippingMethods = async () => {
      try {
        const { data, error } = await supabase
          .from('shipping_methods')
          .select('*')
          .order('base_price', { ascending: true });

        if (error) {
          throw error;
        }

        setShippingMethods(data || []);
      } catch (error) {
        console.error('Erro ao carregar métodos de envio:', error);
        toast({
          title: "Erro ao carregar métodos de envio",
          description: "Não foi possível carregar os métodos de envio.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchShippingMethods();
  }, [toast]);

  const handleStatusChange = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('shipping_methods')
        .update({ active: isActive })
        .eq('id', id);

      if (error) {
        throw error;
      }

      setShippingMethods(
        shippingMethods.map(method => 
          method.id === id ? { ...method, active: isActive } : method
        )
      );

      toast({
        title: "Status atualizado",
        description: `Método de envio ${isActive ? 'ativado' : 'desativado'} com sucesso.`
      });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status do método de envio.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-grow p-8 ml-64">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Métodos de Entrega</h1>
          
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Novo Método de Entrega
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          </div>
        ) : shippingMethods.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <Truck className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Nenhum método de envio encontrado</h2>
            <p className="text-gray-500 mb-6">
              Adicione um método de envio para começar.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Método de Envio
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shippingMethods.map((method) => (
              <Card key={method.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{method.name}</CardTitle>
                      <CardDescription>{method.description}</CardDescription>
                    </div>
                    <div className={`p-2 rounded-full ${method.active ? 'bg-green-100' : 'bg-red-100'}`}>
                      {method.active ? (
                        <Truck className="h-5 w-5 text-green-600" />
                      ) : (
                        <Ban className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Preço base:</span>
                      <span className="font-medium">R$ {method.base_price.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Preço por kg:</span>
                      <span className="font-medium">R$ {method.price_per_kg.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Tempo estimado:</span>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-gray-400" />
                        <span className="font-medium">{method.estimated_days}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id={`status-${method.id}`}
                      checked={method.active || false}
                      onCheckedChange={(checked) => handleStatusChange(method.id, checked)}
                    />
                    <Label htmlFor={`status-${method.id}`}>
                      {method.active ? 'Ativo' : 'Inativo'}
                    </Label>
                  </div>
                  <Button variant="outline" size="sm">Editar</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Shipping;
