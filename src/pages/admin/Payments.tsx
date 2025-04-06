
import React, { useState } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CreditCard, Banknote, QrCode, Wallet, PlusCircle, Settings } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  active: boolean;
  fee: string;
}

const Payments = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      name: 'Cartão de Crédito',
      description: 'Pagamento via cartão de crédito com aprovação imediata',
      icon: CreditCard,
      active: true,
      fee: '2,99%'
    },
    {
      id: '2',
      name: 'Boleto Bancário',
      description: 'Pagamento via boleto com compensação em até 3 dias úteis',
      icon: Banknote,
      active: true,
      fee: '1,99%'
    },
    {
      id: '3',
      name: 'PIX',
      description: 'Pagamento instantâneo via PIX',
      icon: QrCode,
      active: true,
      fee: '0,99%'
    },
    {
      id: '4',
      name: 'Carteira Digital',
      description: 'Integração com carteiras digitais',
      icon: Wallet,
      active: false,
      fee: '2,49%'
    },
  ]);

  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [currentMethod, setCurrentMethod] = useState<PaymentMethod | null>(null);
  const [gatewayDialogOpen, setGatewayDialogOpen] = useState(false);
  const [newMethodDialogOpen, setNewMethodDialogOpen] = useState(false);
  const { toast } = useToast();

  const toggleMethodStatus = (id: string) => {
    setPaymentMethods(methods => 
      methods.map(method => 
        method.id === id ? { ...method, active: !method.active } : method
      )
    );
    
    toast({
      title: "Status atualizado",
      description: "O status do método de pagamento foi atualizado com sucesso."
    });
  };

  const openConfigDialog = (method: PaymentMethod) => {
    setCurrentMethod(method);
    setConfigDialogOpen(true);
  };

  const handleSaveConfig = () => {
    setConfigDialogOpen(false);
    toast({
      title: "Configurações salvas",
      description: "As configurações foram atualizadas com sucesso."
    });
  };

  const handleAddPaymentMethod = () => {
    setNewMethodDialogOpen(true);
  };

  const handleUpdateGateway = () => {
    setGatewayDialogOpen(false);
    toast({
      title: "Gateway atualizado",
      description: "As configurações do gateway foram atualizadas com sucesso."
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-grow p-8 ml-64">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Métodos de Pagamento</h1>
          
          <Button onClick={handleAddPaymentMethod}>
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
                    <span className="font-medium">{method.fee}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id={`status-${method.id}`}
                    checked={method.active}
                    onCheckedChange={() => toggleMethodStatus(method.id)}
                  />
                  <Label htmlFor={`status-${method.id}`}>
                    {method.active ? 'Ativo' : 'Inativo'}
                  </Label>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => openConfigDialog(method)}
                >
                  Configurar
                </Button>
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
              <Button onClick={() => setGatewayDialogOpen(true)}>Atualizar Configurações</Button>
            </CardFooter>
          </Card>
        </div>

        {/* Diálogo de Configuração de Método de Pagamento */}
        <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Configurar {currentMethod?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="payment-fee">Taxa de Transação (%)</Label>
                <Input 
                  id="payment-fee" 
                  defaultValue={currentMethod?.fee.replace('%', '')}
                  placeholder="Ex: 2,99" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment-description">Descrição</Label>
                <Input 
                  id="payment-description" 
                  defaultValue={currentMethod?.description}
                  placeholder="Descrição do método de pagamento" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment-key">Chave de Integração</Label>
                <Input 
                  id="payment-key" 
                  type="password" 
                  placeholder="Chave de integração" 
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setConfigDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="button" onClick={handleSaveConfig}>
                Salvar Configurações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Diálogo de Gateway */}
        <Dialog open={gatewayDialogOpen} onOpenChange={setGatewayDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Gateway de Pagamento</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="gateway-api-key">Chave de API</Label>
                <Input 
                  id="gateway-api-key" 
                  placeholder="Sua chave de API" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gateway-merchant-id">ID do Comerciante</Label>
                <Input 
                  id="gateway-merchant-id" 
                  placeholder="Seu ID de comerciante" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gateway-webhook">URL de Webhook</Label>
                <Input 
                  id="gateway-webhook" 
                  placeholder="https://sua-loja.com/api/webhook/pagamentos" 
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Switch id="gateway-sandbox" />
                  <span>Ambiente de Sandbox</span>
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setGatewayDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="button" onClick={handleUpdateGateway}>
                Salvar Configurações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Diálogo de Novo Método */}
        <Dialog open={newMethodDialogOpen} onOpenChange={setNewMethodDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Método de Pagamento</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="new-method-name">Nome</Label>
                <Input 
                  id="new-method-name" 
                  placeholder="Nome do método de pagamento" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-method-description">Descrição</Label>
                <Input 
                  id="new-method-description" 
                  placeholder="Descrição do método" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-method-fee">Taxa (%)</Label>
                <Input 
                  id="new-method-fee" 
                  placeholder="Ex: 2,99" 
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setNewMethodDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="button" onClick={() => {
                setNewMethodDialogOpen(false);
                toast({
                  title: "Método adicionado",
                  description: "O novo método de pagamento foi adicionado com sucesso."
                });
              }}>
                Adicionar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Payments;
