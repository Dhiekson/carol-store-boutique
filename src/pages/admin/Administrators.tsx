
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProfileType } from '@/integrations/supabase/db-types';
import Sidebar from '@/components/admin/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, User, Mail, Shield, X, Check, Menu } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { useIsMobile } from '@/hooks/use-mobile';

const Administrators = () => {
  const [admins, setAdmins] = useState<ProfileType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const [newAdmin, setNewAdmin] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [creatingAdmin, setCreatingAdmin] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      console.log('Fetching administrators...');
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'admin')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching admins:', error);
        throw error;
      }

      console.log('Admins data:', data);
      setAdmins(data || []);
    } catch (error) {
      console.error('Error loading admins:', error);
      toast({
        title: "Erro ao carregar administradores",
        description: "Não foi possível carregar a lista de administradores.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const createAdmin = async () => {
    if (!newAdmin.email || !newAdmin.password || !newAdmin.firstName) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setCreatingAdmin(true);

    try {
      // 1. Create the user in auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newAdmin.email,
        password: newAdmin.password
      });

      if (authError) throw authError;
      
      // 2. Update the profile to be admin if user was created
      if (authData && authData.user) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            role: 'admin',
            first_name: newAdmin.firstName,
            last_name: newAdmin.lastName,
            email: newAdmin.email
          })
          .eq('id', authData.user.id);

        if (updateError) throw updateError;
        
        toast({
          title: "Administrador criado",
          description: "O novo administrador foi adicionado com sucesso!",
        });
        
        // Reset form and refresh list
        setNewAdmin({ email: '', password: '', firstName: '', lastName: '' });
        setDialogOpen(false);
        fetchAdmins();
      } else {
        throw new Error("Não foi possível criar o usuário");
      }
    } catch (error: any) {
      console.error('Error creating admin:', error);
      toast({
        title: "Erro ao criar administrador",
        description: error.message || "Não foi possível criar o administrador.",
        variant: "destructive"
      });
    } finally {
      setCreatingAdmin(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAdmin(prev => ({ ...prev, [name]: value }));
  };
  
  const getFullName = (admin: ProfileType) => {
    const firstName = admin.first_name || '';
    const lastName = admin.last_name || '';
    return `${firstName} ${lastName}`.trim() || 'Administrador sem nome';
  };
  
  const filteredAdmins = admins.filter(admin => {
    const fullName = getFullName(admin).toLowerCase();
    const adminEmail = admin.email?.toLowerCase() || '';
    const searchLower = searchQuery.toLowerCase();
    
    return fullName.includes(searchLower) || adminEmail.includes(searchLower);
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      {isMobile ? (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-40">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar />
          </SheetContent>
        </Sheet>
      ) : (
        <Sidebar />
      )}
      
      <main className={`flex-grow p-4 sm:p-8 ${isMobile ? 'ml-0' : 'ml-64'} pt-16 sm:pt-8`}>
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Administradores</h1>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Buscar administradores..." 
                className="pl-9 w-full sm:w-auto min-w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="default" className="bg-carol-red hover:bg-carol-red/90 w-full sm:w-auto">
                  <User className="h-4 w-4 mr-2" />
                  Novo Administrador
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Administrador</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      placeholder="admin@exemplo.com"
                      value={newAdmin.email}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha *</Label>
                    <Input 
                      id="password" 
                      name="password" 
                      type="password" 
                      placeholder="••••••••"
                      value={newAdmin.password}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nome *</Label>
                      <Input 
                        id="firstName" 
                        name="firstName" 
                        placeholder="Nome"
                        value={newAdmin.firstName}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Sobrenome</Label>
                      <Input 
                        id="lastName" 
                        name="lastName" 
                        placeholder="Sobrenome"
                        value={newAdmin.lastName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" className="mr-2" onClick={() => setDialogOpen(false)}>
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button 
                    onClick={createAdmin} 
                    disabled={creatingAdmin}
                    className="bg-carol-red hover:bg-carol-red/90"
                  >
                    {creatingAdmin ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Criando...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Criar Administrador
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-carol-red"></div>
          </div>
        ) : filteredAdmins.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <Shield className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Nenhum administrador encontrado</h2>
            <p className="text-gray-500 mb-6">
              {searchQuery ? 'Nenhum administrador corresponde à sua pesquisa.' : 'Não há administradores cadastrados ainda.'}
            </p>
            <Button variant="default" className="bg-carol-red hover:bg-carol-red/90" onClick={() => setDialogOpen(true)}>
              <User className="h-4 w-4 mr-2" />
              Adicionar Administrador
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAdmins.map((admin) => (
              <div key={admin.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-carol-red/10 flex items-center justify-center text-carol-red">
                      <Shield className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium">{getFullName(admin)}</h3>
                      <p className="text-sm text-carol-red font-medium">Administrador</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm">
                  {admin.email && (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{admin.email}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Administrators;
