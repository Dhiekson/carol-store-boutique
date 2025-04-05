
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock product data
const featuredProducts = [
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
  }
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

const FeaturedProducts = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-2">
            Produtos em <span className="text-carol-red">Destaque</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Explore nossa seleção de produtos mais vendidos, cuidadosamente escolhidos para você.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button 
            size="lg" 
            className="bg-carol-black hover:bg-carol-black/80 text-white btn-hover"
            asChild
          >
            <Link to="/produtos">
              Ver Todos os Produtos
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
