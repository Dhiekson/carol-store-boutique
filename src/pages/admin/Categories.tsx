
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Sidebar from '@/components/admin/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Layers, Plus, Pencil, Trash2 } from 'lucide-react';

const AdminCategories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentCategory, setCurrentCategory] = useState<any>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    image_url: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Erro ao carregar categorias",
        description: "Ocorreu um erro ao buscar as categorias.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const openNewCategoryDialog = () => {
    setForm({
      name: '',
      description: '',
      image_url: ''
    });
    setIsEditing(false);
    setCurrentCategory(null);
    setDialogOpen(true);
  };

  const openEditCategoryDialog = (category: any) => {
    setForm({
      name: category.name,
      description: category.description || '',
      image_url: category.image_url || ''
    });
    setIsEditing(true);
    setCurrentCategory(category);
    setDialogOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && currentCategory) {
        // Update existing category
        const { error } = await supabase
          .from('categories')
          .update({
            name: form.name,
            description: form.description,
            image_url: form.image_url,
            updated_at: new Date()
          })
          .eq('id', currentCategory.id);

        if (error) throw error;
        
        toast({
          title: "Categoria atualizada",
          description: "A categoria foi atualizada com sucesso."
        });
        
        // Update local state
        setCategories(categories.map(cat => 
          cat.id === currentCategory.id ? { ...cat, ...form } : cat
        ));
      } else {
        // Create new category
        const { data, error } = await supabase
          .from('categories')
          .insert({
            name: form.name,
            description: form.description,
            image_url: form.image_url
          })
          .select();

        if (error) throw error;
        
        toast({
          title: "Categoria criada",
          description: "A nova categoria foi criada com sucesso."
        });
        
        // Add to local state if we got data back
        if (data && data.length > 0) {
          setCategories([...categories, data[0]]);
        } else {
          // Refresh from database if we didn't get data back
          fetchCategories();
        }
      }
      
      // Close dialog
      setDialogOpen(false);
    } catch (error: any) {
      console.error('Error saving category:', error);
      toast({
        title: "Erro ao salvar categoria",
        description: error.message || "Ocorreu um erro ao salvar a categoria.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta categoria?')) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setCategories(categories.filter(category => category.id !== id));
      toast({
        title: "Categoria excluída",
        description: "A categoria foi removida com sucesso."
      });
    } catch (error: any) {
      console.error('Error deleting category:', error);
      toast({
        title: "Erro ao excluir categoria",
        description: error.message || "Ocorreu um erro ao excluir a categoria.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gerenciar Categorias</h1>
          <Button
            className="bg-carol-red hover:bg-carol-red/90"
            onClick={openNewCategoryDialog}
          >
            <Plus className="h-4 w-4 mr-2" /> Nova Categoria
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-carol-red"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-white rounded-lg shadow">
                <Layers className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Nenhuma categoria encontrada</h2>
                <p className="text-gray-500 mb-6">Adicione categorias para organizar seus produtos</p>
                <Button
                  className="bg-carol-red hover:bg-carol-red/90"
                  onClick={openNewCategoryDialog}
                >
                  <Plus className="h-4 w-4 mr-2" /> Adicionar Categoria
                </Button>
              </div>
            ) : (
              categories.map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <CardTitle>{category.name}</CardTitle>
                    {category.description && (
                      <CardDescription>{category.description}</CardDescription>
                    )}
                  </CardHeader>
                  {category.image_url && (
                    <CardContent>
                      <div className="h-40 rounded-md overflow-hidden">
                        <img
                          src={category.image_url}
                          alt={category.name}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                    </CardContent>
                  )}
                  <CardFooter className="justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditCategoryDialog(category)}
                    >
                      <Pencil className="h-4 w-4 mr-1" /> Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Excluir
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Category Form Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditing ? 'Editar Categoria' : 'Nova Categoria'}
              </DialogTitle>
              <DialogDescription>
                {isEditing
                  ? 'Atualize os detalhes da categoria abaixo.'
                  : 'Preencha os detalhes da nova categoria abaixo.'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Nome *</label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Nome da categoria"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Descrição</label>
                <Textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Descrição da categoria (opcional)"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="image_url" className="text-sm font-medium">URL da Imagem</label>
                <Input
                  id="image_url"
                  name="image_url"
                  value={form.image_url}
                  onChange={handleChange}
                  placeholder="URL da imagem (opcional)"
                />
              </div>
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-carol-red hover:bg-carol-red/90"
                >
                  {isEditing ? 'Salvar alterações' : 'Criar categoria'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminCategories;
