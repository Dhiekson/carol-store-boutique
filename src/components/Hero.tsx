
import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Note: motion is imported but not available. We'll simulate it with CSS animations instead.

const Hero = () => {
  return (
    <div className="relative min-h-[90vh] flex items-center bg-gradient-to-r from-carol-black to-carol-dark-gray overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-40 h-40 rounded-full bg-carol-red blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-60 h-60 rounded-full bg-carol-red blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Text Content */}
        <div className="text-white z-10 animate-fade-in">
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="block text-carol-red">Expresse</span> seu estilo
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-200 max-w-lg">
            Descubra a nossa nova coleção de roupas femininas feitas para destacar a sua beleza natural.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button 
              size="lg" 
              className="bg-carol-red hover:bg-carol-red/80 text-white btn-hover"
              asChild
            >
              <Link to="/produtos">
                Ver Coleção
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white/10 btn-hover"
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
            <div className="aspect-[3/4] bg-gradient-to-br from-carol-red/80 to-carol-dark-red rounded-lg overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1581044777550-4cfa60707c03?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8ZmFzaGlvbiUyMG1vZGVsfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60"
                alt="Fashion Model"
                className="w-full h-full object-cover mix-blend-overlay opacity-90"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-lg shadow-lg animate-bounce">
              <p className="text-carol-black font-semibold">Nova Coleção</p>
              <p className="text-carol-red text-sm">Primavera 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
