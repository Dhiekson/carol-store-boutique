
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative min-h-[90vh] flex items-center bg-gradient-to-r from-pink-50 to-pink-100 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-40 h-40 rounded-full bg-pink-200 blur-3xl opacity-40"></div>
        <div className="absolute bottom-0 right-0 w-60 h-60 rounded-full bg-pink-300 blur-3xl opacity-40"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-rose-200 blur-3xl opacity-30"></div>
      </div>
      
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Text Content */}
        <div className="z-10 animate-fade-in">
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="block text-pink-500">Expresse</span> seu estilo
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-600 max-w-lg">
            Descubra a nossa nova coleção de roupas femininas feitas para destacar a sua beleza natural.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button 
              size="lg" 
              className="bg-pink-500 hover:bg-pink-600 text-white btn-hover"
              asChild
            >
              <Link to="/produtos">
                Ver Coleção
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-pink-500 text-pink-500 hover:bg-pink-50 btn-hover"
              asChild
            >
              <Link to="/produtos/destaque">
                Itens Populares
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Image */}
        <div className="relative h-full flex justify-center items-center">
          <div className="relative w-full max-w-md animate-fade-in">
            <div className="aspect-[3/4] bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=800&q=60"
                alt="Fashion Model"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-lg shadow-lg animate-bounce">
              <p className="text-gray-800 font-semibold">Nova Coleção</p>
              <p className="text-pink-500 text-sm">Primavera 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
