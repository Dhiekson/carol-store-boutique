
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Heart, Search, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
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

// Mock product data
const products = [
  {
    id: 1,
    name: 'Vestido Floral',
    price: 159.90,
    image: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fGRyZXNzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
    category: 'Vestidos',
    isNew: true,
    isSale: false
  },
  {
    id: 2,
    name: 'Calça Jeans Skinny',
    price: 129.90,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8amVhbnN8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    category: 'Calças',
    isNew: false,
    isSale: true
  },
  {
    id: 3,
    name: 'Blusa Cropped',
    price: 79.90,
    image: 'https://images.unsplash.com/photo-1533399710062-f838c1ddb292?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fHdvbWVuJTIwc2hpcnR8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    category: 'Tops',
    isNew: true,
    isSale: false
  },
  {
    id: 4,
    name: 'Saia Midi Plissada',
    price: 119.90,
    image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2tpcnR8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    category: 'Saias',
    isNew: false,
    isSale: true
  },
  {
    id: 5,
    name: 'Vestido Longo',
    price: 199.90,
    image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8ZHJlc3N8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    category: 'Vestidos',
    isNew: false,
    isSale: false
  },
  {
    id: 6,
    name: 'Short Jeans Destroyed',
    price: 99.90,
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fHNob3J0c3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
    category: 'Shorts',
    isNew: true,
    isSale: false
  },
  {
    id: 7,
    name: 'Macacão Jeans',
    price: 179.90,
    image: 'https://images.unsplash.com/photo-1619086303291-0ef7699e4b31?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fGp1bXBzdWl0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
    category: 'Macacão',
    isNew: true,
    isSale: false
  },
  {
    id: 8,
    name: 'Colete Jeans',
    price: 89.90,
    image: 'https://images.unsplash.com/photo-1622445275576-721325763afe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8amVhbnMlMjB2ZXN0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
    category: 'Coletes',
    isNew: false,
    isSale: true
  }
];

// Filter categories
const categories = [
  { id: 'all', name: 'Todas Categorias' },
  { id: 'vestidos', name: 'Vestidos' },
  { id: 'saias', name: 'Saias' },
  { id: 'calcas', name: 'Calças' },
  { id: 'shorts', name: 'Shorts' },
  { id: 'tops', name: 'Blusas e Tops' },
  { id: 'macacao', name: 'Macacão' },
  { id: 'coletes', name: 'Coletes' },
];

const ProductCard = ({ product }) => {
  return (
    <Card className="product-card group">
      {product.isNew && (
        <div className="product-card-badge">Novo</div>
      )}
      {product.isSale && (
        <div className="product-card-badge bg-black">Sale</div>
      )}
      
      <CardContent className="p-0">
        <div className="relative overflow-hidden h-64">
          <Link to={`/produto/${product.id}`}>
            <img 
              src={product.image} 
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
            <span className="font-semibold text-lg">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </span>
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
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
                  {categories.map((category) => (
                    <li key={category.id}>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start ${
                          selectedCategory === category.id
                            ? "text-carol-red font-medium"
                            : "text-gray-700"
                        }`}
                        onClick={() => setSelectedCategory(category.id)}
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
                      placeholder="R$ 0"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Max</label>
                    <Input
                      type="number"
                      placeholder="R$ 500"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Products Grid */}
            <div className="col-span-12 md:col-span-9 lg:col-span-10">
              <div className="flex justify-between items-center mb-6">
                <p className="text-muted-foreground">Mostrando {products.length} produtos</p>
                
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
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
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
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Products;
