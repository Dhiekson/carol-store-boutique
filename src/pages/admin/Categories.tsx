
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CategoryType } from '@/integrations/supabase/db-types';
import Sidebar from '@/components/admin/Sidebar';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, Search, X, Image } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const AdminCategories = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<CategoryType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) {
          throw error;
        }

        setCategories(data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast({
          title: "Erro ao carregar categorias",
          description: "Não foi possível carregar a lista de categorias.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openNewCategoryDialog = () => {
    setFormData({
      name: '',
      description: '',
      image_url: '',
    });
    setIsEditing(false);
    setCurrentCategory(null);
    setDialogOpen(true);
  };

  const openEditCategoryDialog = (category: CategoryType) => {
    setFormData({
      name: category.name,
      description: category.description || '',
      image_url: category.image_url || '',
    });
    setIsEditing(true);
    setCurrentCategory(category);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && currentCategory) {
        const { error } = await supabase
          .from('categories')
          .update({
            name: formData.name,
            description: formData.description,
            image_url: formData.image_url,
            updated_at: new Date()
          })
          .eq('id', currentCategory.id);

        if (error) throw error;

        setCategories(categories.map(cat => 
          cat.id === currentCategory.id ? { ...cat, ...formData } : cat
        ));

        toast({
          title: "Categoria atualizada",
          description: "A categoria foi atualizada com sucesso."
        });
      } else {
        const { data, error } = await supabase
          .from('categories')
          .insert({
            name: formData.name,
            description: formData.description,
            image_url: formData.image_url,
          })
          .select();

        if (error) throw error;

        setCategories([...(data || []), ...categories]);

        toast({
          title: "Categoria criada",
          description: "A categoria foi criada com sucesso."
        });
      }

      setDialogOpen(false);
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: isEditing ? "Erro ao atualizar categoria" : "Erro ao criar categoria",
        description: "Verifique os dados e tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
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
          description: "A categoria foi excluída com sucesso."
        });
      } catch (error) {
        console.error('Error deleting category:', error);
        toast({
          title: "Erro ao excluir categoria",
          description: "Essa categoria pode estar sendo usada por produtos.",
          variant: "destructive"
        });
      }
    }
  };

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-grow p-8 ml-64">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Gerenciar Categorias</h1>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Buscar categorias..." 
                className="pl-9 w-full md:w-auto min-w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button onClick={openNewCategoryDialog}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Nova Categoria
            </Button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Nenhuma categoria encontrada</h2>
            <p className="text-gray-500 mb-6">
              {searchQuery ? 'Nenhuma categoria corresponde à sua pesquisa.' : 'Nenhuma categoria cadastrada ainda.'}
            </p>
            <Button onClick={openNewCategoryDialog}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Adicionar Categoria
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <div 
                key={category.id} 
                className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-40 bg-gray-100 relative">
                  {category.image_url ? (
                    <img 
                      src={category.image_url} 
                      alt={category.name} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-pink-50">
                      <Image className="h-12 w-12 text-pink-200" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                  {category.description && (
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{category.description}</p>
                  )}
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => openEditCategoryDialog(category)}
                    >
                      <Edit className="h-4 w-4 mr-2" /> Editar
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditing ? 'Editar Categoria' : 'Nova Categoria'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Categoria</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nome da categoria"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Descrição da categoria"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image_url">URL da imagem</Label>
                <Input
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  placeholder="https://"
                />
              </div>
              
              <DialogFooter className="gap-2 sm:justify-end">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </DialogClose>
                <Button type="submit">
                  {isEditing ? 'Atualizar' : 'Criar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default AdminCategories;
