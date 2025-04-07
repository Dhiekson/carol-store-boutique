
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Heart, Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { ProductType, CategoryType } from '@/integrations/supabase/db-types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ProductCard = ({ product }: { product: ProductType }) => {
  const isNew = new Date(product.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000; // 7 days
  const isSale = Boolean(product.discount_price);
  
  return (
    <Card className="product-card group">
      {isNew && (
        <div className="absolute top-2 left-2 bg-carol-red text-white px-2 py-1 text-xs font-semibold rounded z-10">Novo</div>
      )}
      {isSale && (
        <div className="absolute top-2 right-2 bg-black text-white px-2 py-1 text-xs font-semibold rounded z-10">Sale</div>
      )}
      
      <CardContent className="p-0">
        <div className="relative overflow-hidden h-64">
          <Link to={`/produto/${product.id}`}>
            <img 
              src={product.image_url || 'https://via.placeholder.com/300'} 
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </Link>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
            <div className="flex justify-center space-x-2">
              <Button 
                size="sm" 
                variant="secondary" 
                className="bg-white text-carol-black hover:bg-gray-200 rounded-full w-10 h-10 p-0 flex items-center justify-center"
              >
                <Heart size={18} />
              </Button>
              <Button 
                size="sm"
                className="bg-carol-red hover:bg-carol-red/80 text-white rounded-full w-10 h-10 p-0 flex items-center justify-center"
              >
                <ShoppingCart size={18} />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <Link to={`/produto/${product.id}`}>
            <h3 className="font-medium text-lg hover:text-carol-red transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-gray-500">{product.category}</p>
          <div className="mt-2 flex items-center justify-between">
            <div>
              {product.discount_price ? (
                <>
                  <span className="font-semibold text-lg text-carol-red">
                    R$ {product.discount_price.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-sm text-gray-400 line-through ml-2">
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </span>
                </>
              ) : (
                <span className="font-semibold text-lg">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </span>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-carol-red hover:bg-carol-red/10"
              asChild
            >
              <Link to={`/produto/${product.id}`}>
                Ver detalhes
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Products = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*');

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Erro ao carregar produtos",
          description: "Não foi possível carregar a lista de produtos.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*');

        if (error) throw error;
        setCategories(data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, [toast]);
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPriceRange(prev => ({ ...prev, [name]: value }));
  };
  
  // Filter and sort the products
  const filteredProducts = products.filter(product => {
    // Text search filter
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    
    // Price filter
    const minPrice = priceRange.min ? parseFloat(priceRange.min) : 0;
    const maxPrice = priceRange.max ? parseFloat(priceRange.max) : Infinity;
    const productPrice = product.discount_price || product.price;
    const matchesPrice = productPrice >= minPrice && productPrice <= maxPrice;
    
    return matchesSearch && matchesCategory && matchesPrice;
  }).sort((a, b) => {
    // Sort based on selected order
    switch (sortOrder) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'price_asc':
        return (a.discount_price || a.price) - (b.discount_price || b.price);
      case 'price_desc':
        return (b.discount_price || b.price) - (a.discount_price || a.price);
      case 'featured':
      default:
        // Featured products (those with discount) first, then by name
        const aHasDiscount = a.discount_price !== null;
        const bHasDiscount = b.discount_price !== null;
        if (aHasDiscount && !bHasDiscount) return -1;
        if (!aHasDiscount && bHasDiscount) return 1;
        return a.name.localeCompare(b.name);
    }
  });
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-32 pb-16 z-0">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h1 className="font-playfair text-3xl font-bold mb-4 md:mb-0">
              Nossos <span className="text-carol-red">Produtos</span>
            </h1>
            
            <div className="flex w-full md:w-auto items-center gap-2">
              <div className="relative flex-grow">
                <Input 
                  type="search" 
                  placeholder="Buscar produtos..." 
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={toggleFilters}
                className="md:hidden"
                aria-label="Toggle filters"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar Filters */}
            <div className={`col-span-12 md:col-span-3 lg:col-span-2 space-y-6 ${showFilters ? 'block' : 'hidden md:block'}`}>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h3 className="font-medium text-lg mb-3">Categorias</h3>
                <ul className="space-y-2">
                  <li>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start ${
                        selectedCategory === 'all'
                          ? "text-carol-red font-medium"
                          : "text-gray-700"
                      }`}
                      onClick={() => setSelectedCategory('all')}
                    >
                      Todas Categorias
                    </Button>
                  </li>
                  {categories.map((category) => (
                    <li key={category.id}>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start ${
                          selectedCategory === category.name
                            ? "text-carol-red font-medium"
                            : "text-gray-700"
                        }`}
                        onClick={() => setSelectedCategory(category.name)}
                      >
                        {category.name}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h3 className="font-medium text-lg mb-3">Preço</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm text-gray-500">Min</label>
                    <Input
                      type="number"
                      name="min"
                      placeholder="R$ 0"
                      min="0"
                      value={priceRange.min}
                      onChange={handlePriceChange}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Max</label>
                    <Input
                      type="number"
                      name="max"
                      placeholder="R$ 500"
                      min="0"
                      value={priceRange.max}
                      onChange={handlePriceChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Products Grid */}
            <div className="col-span-12 md:col-span-9 lg:col-span-10">
              <div className="flex justify-between items-center mb-6">
                <p className="text-muted-foreground">
                  Mostrando {filteredProducts.length} produtos
                </p>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm">Ordenar por:</span>
                  <Select
                    value={sortOrder}
                    onValueChange={setSortOrder}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Em destaque</SelectItem>
                      <SelectItem value="newest">Mais recentes</SelectItem>
                      <SelectItem value="price_asc">Preço: Menor para maior</SelectItem>
                      <SelectItem value="price_desc">Preço: Maior para menor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="flex flex-col items-center">
                    <Loader2 className="h-12 w-12 animate-spin text-carol-red" />
                    <p className="mt-4 text-gray-500">Carregando produtos...</p>
                  </div>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow-sm border">
                  <h2 className="text-xl font-medium mb-2">Nenhum produto encontrado</h2>
                  <p className="text-gray-500 mb-4">
                    Tente ajustar os filtros ou realizar uma nova busca.
                  </p>
                  <Button onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setPriceRange({ min: '', max: '' });
                  }}>
                    Limpar filtros
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
              
              {filteredProducts.length > 0 && (
                <div className="mt-8">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious href="#" />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#" isActive>1</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">2</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">3</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext href="#" />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Products;
