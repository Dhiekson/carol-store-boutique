
import React, { useState } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, PlusCircle, Clock, Ban } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([
    {
      id: '1',
      name: 'Padrão',
      description: 'Entrega padrão em todo o Brasil',
      base_price: 12.90,
      price_per_kg: 1.50,
      estimated_days: '3 a 5 dias úteis',
      active: true
    },
    {
      id: '2',
      name: 'Expressa',
      description: 'Entrega expressa em até 2 dias',
      base_price: 25.90,
      price_per_kg: 2.50,
      estimated_days: '1 a 2 dias úteis',
      active: true
    },
    {
      id: '3',
      name: 'Econômica',
      description: 'Entrega econômica para todo o Brasil',
      base_price: 8.90,
      price_per_kg: 1.00,
      estimated_days: '5 a 10 dias úteis',
      active: false
    },
  ]);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [newMethodDialogOpen, setNewMethodDialogOpen] = useState<boolean>(false);
  const [editMethodDialogOpen, setEditMethodDialogOpen] = useState<boolean>(false);
  const [currentMethod, setCurrentMethod] = useState<ShippingMethod | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    base_price: '',
    price_per_kg: '',
    estimated_days: '',
    active: true
  });
  
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, active: checked }));
  };

  const handleStatusChange = (id: string, isActive: boolean) => {
    setShippingMethods(
      shippingMethods.map(method => 
        method.id === id ? { ...method, active: isActive } : method
      )
    );

    toast({
      title: "Status atualizado",
      description: `Método de envio ${isActive ? 'ativado' : 'desativado'} com sucesso.`
    });
  };

  const handleAddMethod = () => {
    setFormData({
      name: '',
      description: '',
      base_price: '',
      price_per_kg: '',
      estimated_days: '',
      active: true
    });
    
    setNewMethodDialogOpen(true);
  };

  const handleEditMethod = (method: ShippingMethod) => {
    setCurrentMethod(method);
    setFormData({
      name: method.name,
      description: method.description || '',
      base_price: method.base_price.toString(),
      price_per_kg: method.price_per_kg.toString(),
      estimated_days: method.estimated_days,
      active: method.active || false
    });
    
    setEditMethodDialogOpen(true);
  };

  const createNewMethod = () => {
    const newMethod: ShippingMethod = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      base_price: parseFloat(formData.base_price),
      price_per_kg: parseFloat(formData.price_per_kg),
      estimated_days: formData.estimated_days,
      active: formData.active
    };
    
    setShippingMethods(prev => [newMethod, ...prev]);
    setNewMethodDialogOpen(false);
    
    toast({
      title: "Método de entrega adicionado",
      description: "O novo método de entrega foi adicionado com sucesso."
    });
  };

  const updateMethod = () => {
    if (!currentMethod) return;
    
    const updatedMethod: ShippingMethod = {
      ...currentMethod,
      name: formData.name,
      description: formData.description,
      base_price: parseFloat(formData.base_price),
      price_per_kg: parseFloat(formData.price_per_kg),
      estimated_days: formData.estimated_days,
      active: formData.active
    };
    
    setShippingMethods(prev => 
      prev.map(method => method.id === currentMethod.id ? updatedMethod : method)
    );
    
    setEditMethodDialogOpen(false);
    
    toast({
      title: "Método de entrega atualizado",
      description: "O método de entrega foi atualizado com sucesso."
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-grow p-8 ml-64">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Métodos de Entrega</h1>
          
          <Button onClick={handleAddMethod}>
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
            <Button onClick={handleAddMethod}>
              <PlusCircle className="h-4 w-4 mr-2" />
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
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditMethod(method)}
                  >
                    Editar
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Diálogo para adicionar novo método de entrega */}
        <Dialog open={newMethodDialogOpen} onOpenChange={setNewMethodDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Adicionar Método de Entrega</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ex: Entrega Expressa"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Ex: Entrega em até 2 dias úteis"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="base_price">Preço Base (R$)</Label>
                  <Input
                    id="base_price"
                    name="base_price"
                    type="number"
                    step="0.01"
                    value={formData.base_price}
                    onChange={handleInputChange}
                    placeholder="Ex: 12,90"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price_per_kg">Preço por kg (R$)</Label>
                  <Input
                    id="price_per_kg"
                    name="price_per_kg"
                    type="number"
                    step="0.01"
                    value={formData.price_per_kg}
                    onChange={handleInputChange}
                    placeholder="Ex: 1,50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimated_days">Tempo Estimado</Label>
                <Input
                  id="estimated_days"
                  name="estimated_days"
                  value={formData.estimated_days}
                  onChange={handleInputChange}
                  placeholder="Ex: 3 a 5 dias úteis"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="active"
                  checked={formData.active}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="active">
                  {formData.active ? 'Ativo' : 'Inativo'}
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewMethodDialogOpen(false)}>Cancelar</Button>
              <Button onClick={createNewMethod}>Adicionar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Diálogo para editar método de entrega */}
        <Dialog open={editMethodDialogOpen} onOpenChange={setEditMethodDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Editar Método de Entrega</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Descrição</Label>
                <Input
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-base_price">Preço Base (R$)</Label>
                  <Input
                    id="edit-base_price"
                    name="base_price"
                    type="number"
                    step="0.01"
                    value={formData.base_price}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-price_per_kg">Preço por kg (R$)</Label>
                  <Input
                    id="edit-price_per_kg"
                    name="price_per_kg"
                    type="number"
                    step="0.01"
                    value={formData.price_per_kg}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-estimated_days">Tempo Estimado</Label>
                <Input
                  id="edit-estimated_days"
                  name="estimated_days"
                  value={formData.estimated_days}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="edit-active"
                  checked={formData.active}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="edit-active">
                  {formData.active ? 'Ativo' : 'Inativo'}
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditMethodDialogOpen(false)}>Cancelar</Button>
              <Button onClick={updateMethod}>Salvar Alterações</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Shipping;
