
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative min-h-[90vh] flex items-center bg-gradient-to-r from-gray-900 to-black overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-40 h-40 rounded-full bg-carol-red blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-60 h-60 rounded-full bg-carol-red blur-3xl opacity-20"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-carol-red blur-3xl opacity-15"></div>
      </div>
      
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Text Content */}
        <div className="z-10 animate-fade-in">
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="block text-carol-red">Elegância</span> 
            <span className="text-white">e Estilo</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-300 max-w-lg">
            Descubra nossa coleção exclusiva de moda feminina, com peças delicadas, modernas e cheias de personalidade para valorizar cada mulher.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button 
              size="lg" 
              className="bg-carol-red hover:bg-carol-red/90 text-white btn-hover"
              asChild
            >
              <Link to="/produtos">
                Ver Coleção
              </Link>
            </Button>
            <Button 
              size="lg" 
              className="bg-carol-red hover:bg-carol-red/90 text-white btn-hover"
              asChild
            >
              <Link to="/produtos/destaque">
                Novidades
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Image */}
        <div className="relative h-full flex justify-center items-center">
          <div className="relative w-full max-w-md animate-fade-in">
            <div className="aspect-[3/4] rounded-lg overflow-hidden shadow-xl border border-carol-red/20">
              <img
                src="https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=800&q=80"
                alt="Modelo com roupa elegante"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-black p-4 rounded-lg shadow-lg border-t-4 border-carol-red">
              <p className="text-white font-semibold">Nova Coleção</p>
              <p className="text-carol-red text-sm font-medium">Primavera 2025</p>
            </div>
            <div className="absolute top-4 left-4 bg-carol-red text-white px-3 py-1 rounded-full text-sm font-medium">
              Exclusivo
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
