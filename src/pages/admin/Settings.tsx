
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sidebar from '@/components/admin/Sidebar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { CreditCard, Truck } from 'lucide-react';

const Settings = () => {
  const { toast } = useToast();
  const [paymentConfigOpen, setPaymentConfigOpen] = useState(false);
  const [shippingConfigOpen, setShippingConfigOpen] = useState(false);

  const handleSaveSettings = () => {
    toast({
      title: "Configurações salvas",
      description: "As configurações foram atualizadas com sucesso."
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-grow p-8 ml-64">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Configurações</h1>
          <p className="text-muted-foreground mt-1">Gerencie as configurações da sua loja.</p>
        </div>
        
        <Tabs defaultValue="store">
          <TabsList className="mb-6">
            <TabsTrigger value="store">Loja</TabsTrigger>
            <TabsTrigger value="account">Conta</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="integrations">Integrações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="store">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações da Loja</CardTitle>
                  <CardDescription>
                    Configure as informações básicas da sua loja.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="store-name">Nome da Loja</Label>
                      <Input id="store-name" placeholder="Carol Store" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store-email">Email de Contato</Label>
                      <Input id="store-email" placeholder="contato@carolstore.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="store-description">Descrição da Loja</Label>
                    <Textarea 
                      id="store-description" 
                      placeholder="Descreva brevemente sua loja..."
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="store-phone">Telefone</Label>
                      <Input id="store-phone" placeholder="(99) 99999-9999" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store-currency">Moeda</Label>
                      <Select defaultValue="BRL">
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar moeda" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BRL">Real Brasileiro (R$)</SelectItem>
                          <SelectItem value="USD">Dólar Americano ($)</SelectItem>
                          <SelectItem value="EUR">Euro (€)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store-timezone">Fuso Horário</Label>
                      <Select defaultValue="America/Sao_Paulo">
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar fuso horário" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/Sao_Paulo">Brasília (UTC-3)</SelectItem>
                          <SelectItem value="America/Manaus">Manaus (UTC-4)</SelectItem>
                          <SelectItem value="America/Rio_Branco">Rio Branco (UTC-5)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-end">
                  <Button onClick={handleSaveSettings}>Salvar Alterações</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Endereço</CardTitle>
                  <CardDescription>
                    Configure o endereço da sua loja física ou centro de distribuição.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Input id="address" placeholder="Rua, número" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade</Label>
                      <Input id="city" placeholder="Cidade" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">Estado</Label>
                      <Input id="state" placeholder="Estado" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">CEP</Label>
                      <Input id="zip" placeholder="00000-000" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-end">
                  <Button onClick={handleSaveSettings}>Salvar Alterações</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Configurações da Conta</CardTitle>
                <CardDescription>
                  Gerencie suas informações de conta.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input id="name" placeholder="Seu nome" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" placeholder="seu@email.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current-password">Senha Atual</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nova Senha</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button>Atualizar Conta</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Preferências de Notificação</CardTitle>
                <CardDescription>
                  Configure como você recebe notificações.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base" htmlFor="new-order">
                        Novos Pedidos
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receba notificações quando novos pedidos forem realizados.
                      </p>
                    </div>
                    <Switch id="new-order" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base" htmlFor="low-stock">
                        Estoque Baixo
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Seja alertado quando produtos estiverem com pouco estoque.
                      </p>
                    </div>
                    <Switch id="low-stock" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base" htmlFor="customer-messages">
                        Mensagens de Clientes
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receba notificações de novas mensagens de clientes.
                      </p>
                    </div>
                    <Switch id="customer-messages" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base" htmlFor="marketing">
                        Emails de Marketing
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receba atualizações sobre novos recursos e promoções.
                      </p>
                    </div>
                    <Switch id="marketing" defaultChecked />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button>Salvar Preferências</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="integrations">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Integração de Pagamento</CardTitle>
                  <CardDescription>Conecte-se ao seu provedor de pagamento.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center mr-3">
                        <CreditCard className="h-6 w-6 text-pink-500" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium">Provedor de Pagamento</h3>
                        <p className="text-sm text-muted-foreground">Conectado</p>
                      </div>
                      <Button variant="outline" onClick={() => setPaymentConfigOpen(true)}>Configurar</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Integração de Frete</CardTitle>
                  <CardDescription>Conecte-se aos serviços de frete.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                        <Truck className="h-6 w-6 text-gray-500" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium">Serviço de Frete</h3>
                        <p className="text-sm text-muted-foreground">Desconectado</p>
                      </div>
                      <Button variant="outline" onClick={() => setShippingConfigOpen(true)}>Conectar</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>API e Webhooks</CardTitle>
                  <CardDescription>Configure integrações personalizadas.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="api-key">Chave de API</Label>
                    <div className="flex">
                      <Input id="api-key" className="flex-grow" value="●●●●●●●●●●●●●●●●" readOnly />
                      <Button className="ml-2">Gerar Nova</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="webhook-url">URL de Webhook</Label>
                    <Input id="webhook-url" placeholder="https://seu-site.com/webhook" />
                  </div>
                </CardContent>
                <CardFooter className="justify-end">
                  <Button onClick={handleSaveSettings}>Salvar Configurações</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Diálogo de Configuração de Pagamentos */}
        <Dialog open={paymentConfigOpen} onOpenChange={setPaymentConfigOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Configurar Integração de Pagamento</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="payment-provider">Provedor de Pagamento</Label>
                <Select defaultValue="stripe">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um provedor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="mercadopago">MercadoPago</SelectItem>
                    <SelectItem value="pagseguro">PagSeguro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment-api-key">Chave de API</Label>
                <Input 
                  id="payment-api-key" 
                  placeholder="Sua chave de API" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment-secret">Chave Secreta</Label>
                <Input 
                  id="payment-secret" 
                  type="password"
                  placeholder="Sua chave secreta" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment-webhook">URL de Webhook</Label>
                <Input 
                  id="payment-webhook" 
                  placeholder="https://sua-loja.com/webhook/pagamento" 
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch id="payment-test-mode" />
                  <Label htmlFor="payment-test-mode">Modo de Teste</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  No modo de teste, as transações não serão reais.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setPaymentConfigOpen(false)}>Cancelar</Button>
              <Button onClick={() => {
                setPaymentConfigOpen(false);
                toast({
                  title: "Integração configurada",
                  description: "A integração de pagamento foi configurada com sucesso."
                });
              }}>Salvar Configurações</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Diálogo de Configuração de Frete */}
        <Dialog open={shippingConfigOpen} onOpenChange={setShippingConfigOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Configurar Integração de Frete</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="shipping-provider">Provedor de Frete</Label>
                <Select defaultValue="correios">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um provedor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="correios">Correios</SelectItem>
                    <SelectItem value="jadlog">JadLog</SelectItem>
                    <SelectItem value="fedex">FedEx</SelectItem>
                    <SelectItem value="dhl">DHL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="shipping-api-key">Chave de API</Label>
                <Input 
                  id="shipping-api-key" 
                  placeholder="Sua chave de API" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shipping-contract">Número do Contrato</Label>
                <Input 
                  id="shipping-contract"
                  placeholder="Número do contrato" 
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch id="shipping-test-mode" />
                  <Label htmlFor="shipping-test-mode">Modo de Teste</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  No modo de teste, as cotações de frete não serão reais.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShippingConfigOpen(false)}>Cancelar</Button>
              <Button onClick={() => {
                setShippingConfigOpen(false);
                toast({
                  title: "Integração configurada",
                  description: "A integração de frete foi configurada com sucesso."
                });
              }}>Salvar Configurações</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Settings;
