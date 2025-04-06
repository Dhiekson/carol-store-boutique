
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import { ShoppingBag, User, Settings, Heart } from 'lucide-react';

const UserProfile = () => {
  const { user, profile, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    phone: '',
  });
  const { toast } = useToast();
  
  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        address: profile.address || '',
        city: profile.city || '',
        state: profile.state || '',
        zip_code: profile.zip_code || '',
        phone: profile.phone || '',
      });
    }
  }, [profile]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await updateProfile(formData);
      
      if (!error) {
        toast({
          title: "Perfil atualizado",
          description: "Suas informações foram salvas com sucesso."
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erro ao atualizar perfil",
        description: "Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-playfair text-3xl font-bold mb-8">
              Minha <span className="text-carol-red">Conta</span>
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex flex-col items-center">
                    <div className="bg-pink-50 h-20 w-20 rounded-full flex items-center justify-center mb-4">
                      <User className="h-10 w-10 text-pink-400" />
                    </div>
                    <h2 className="font-medium text-lg">
                      {profile?.first_name} {profile?.last_name}
                    </h2>
                    <p className="text-gray-500 text-sm mb-4">{user?.email}</p>
                    
                    <div className="w-full space-y-2 mt-2">
                      <Link
                        to="/meus-pedidos"
                        className="w-full flex items-center justify-center gap-2 py-2 border border-carol-red text-carol-red rounded-md hover:bg-carol-red/10 transition-colors"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        Meus Pedidos
                      </Link>
                      <Link
                        to="/perfil"
                        className="w-full flex items-center justify-center gap-2 py-2 bg-pink-100 text-pink-700 rounded-md hover:bg-pink-200 transition-colors"
                      >
                        <Settings className="h-4 w-4" />
                        Configurações
                      </Link>
                      <Link
                        to="/favoritos"
                        className="w-full flex items-center justify-center gap-2 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                      >
                        <Heart className="h-4 w-4" />
                        Lista de Desejos
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="font-semibold text-xl mb-4">Informações Pessoais</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first_name">Nome</Label>
                        <Input
                          id="first_name"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleChange}
                          placeholder="Nome"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="last_name">Sobrenome</Label>
                        <Input
                          id="last_name"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleChange}
                          placeholder="Sobrenome"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Endereço</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Rua, número, complemento"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">Cidade</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="Cidade"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="state">Estado</Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          placeholder="Estado"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="zip_code">CEP</Label>
                        <Input
                          id="zip_code"
                          name="zip_code"
                          value={formData.zip_code}
                          onChange={handleChange}
                          placeholder="00000-000"
                        />
                      </div>
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full md:w-auto bg-pink-500 hover:bg-pink-600 text-white"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Salvando...
                        </span>
                      ) : (
                        "Salvar alterações"
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserProfile;
