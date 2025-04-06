import React from 'react';
import Sidebar from '@/components/admin/Sidebar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CreditCard, Banknote, QrCode, Wallet, PlusCircle } from 'lucide-react';

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  active: boolean;
}

const Payments = () => {
  const paymentMethods: PaymentMethod[] = [
    {
      id: '1',
      name: 'Cartão de Crédito',
      description: 'Pagamento via cartão de crédito com aprovação imediata',
      icon: CreditCard,
      active: true,
    },
    {
      id: '2',
      name: 'Boleto Bancário',
      description: 'Pagamento via boleto com compensação em até 3 dias úteis',
      icon: Banknote,
      active: true,
    },
    {
      id: '3',
      name: 'PIX',
      description: 'Pagamento instantâneo via PIX',
      icon: QrCode,
      active: true,
    },
    {
      id: '4',
      name: 'Carteira Digital',
      description: 'Integração com carteiras digitais',
      icon: Wallet,
      active: false,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-grow p-8 ml-64">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Métodos de Pagamento</h1>
          
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Adicionar Método de Pagamento
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paymentMethods.map((method) => (
            <Card key={method.id} className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{method.name}</CardTitle>
                    <CardDescription>{method.description}</CardDescription>
                  </div>
                  <div className={`p-2 rounded-full ${method.active ? 'bg-carol-red/10' : 'bg-gray-100'}`}>
                    <method.icon className={`h-5 w-5 ${method.active ? 'text-carol-red' : 'text-gray-400'}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Status:</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${method.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {method.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Taxa:</span>
                    <span className="font-medium">2,99%</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id={`status-${method.id}`}
                    checked={method.active}
                  />
                  <Label htmlFor={`status-${method.id}`}>
                    {method.active ? 'Ativo' : 'Inativo'}
                  </Label>
                </div>
                <Button variant="outline" size="sm">Configurar</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6">Gateway de Pagamento</h2>
          
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Configurações do Gateway</CardTitle>
              <CardDescription>Configure as credenciais do seu processador de pagamentos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="api-key">Chave de API</Label>
                  <Input id="api-key" type="password" value="●●●●●●●●●●●●●●●●" disabled />
                </div>
                <div>
                  <Label htmlFor="merchant-id">ID do Comerciante</Label>
                  <Input id="merchant-id" type="password" value="●●●●●●●●●●" disabled />
                </div>
              </div>
              <div>
                <Label htmlFor="webhook-url">URL de Webhook</Label>
                <Input id="webhook-url" value="https://sua-loja.com/api/webhook/pagamentos" disabled />
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button>Atualizar Configurações</Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Payments;
