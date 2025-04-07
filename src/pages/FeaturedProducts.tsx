
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

// Featured product data - this would typically come from a database
const featuredProducts = [
  {
    id: 1,
    name: 'Vestido Floral Primavera',
    price: 179.90,
    image: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fGRyZXNzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
    category: 'Vestidos',
    isNew: true,
  },
  {
    id: 2,
    name: 'Blusa Casual Off-white',
    price: 89.90,
    image: 'https://images.unsplash.com/photo-1533399710062-f838c1ddb292?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fHdvbWVuJTIwc2hpcnR8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    category: 'Blusas',
    isNew: true,
  },
  {
    id: 3,
    name: 'Saia Midi Elegante',
    price: 129.90,
    image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2tpcnR8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    category: 'Saias',
    isNew: true,
  },
  {
    id: 4,
    name: 'Calça Skinny Premium',
    price: 159.90,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8amVhbnN8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    category: 'Calças',
    isNew: true,
  },
  {
    id: 5,
    name: 'Blazer Elegante',
    price: 199.90,
    image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8d29tZW4lMjBibGF6ZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    category: 'Casacos',
    isNew: true,
  },
  {
    id: 6,
    name: 'Vestido Longo',
    price: 229.90,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8ZXZlbmluZyUyMGRyZXNzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
    category: 'Vestidos',
    isNew: true,
  }
];

const ProductCard = ({ product }: { product: any }) => {
  return (
    <Card className="product-card group">
      {product.isNew && (
        <div className="product-card-badge">Novo</div>
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

const FeaturedProductsPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-2">
              Nossas <span className="text-carol-red">Novidades</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Conheça as peças mais recentes da nossa coleção, escolhidas a dedo para você se destacar com estilo e sofisticação.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button 
              size="lg" 
              className="bg-carol-red hover:bg-carol-red/90 text-white btn-hover"
              asChild
            >
              <Link to="/produtos">
                Ver Todos os Produtos
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FeaturedProductsPage;
