
import React from 'react';
import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';
import Categories from '@/components/Categories';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-16">
        <Hero />
        <FeaturedProducts />
        <Categories />
        
        <section className="py-16 bg-carol-black text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-2">
                <span className="text-carol-red">Carol</span>StoreUdi
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                A sua loja de moda feminina em Uberlândia. Encontre as últimas tendências
                e estilos para expressar toda a sua personalidade.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-white/5 rounded-lg">
                <div className="w-16 h-16 bg-carol-red/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-carol-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-playfair text-xl font-semibold mb-2">Entrega Rápida</h3>
                <p className="text-gray-400 text-sm">
                  Produtos entregues rapidamente para você aproveitar o quanto antes.
                </p>
              </div>
              
              <div className="text-center p-6 bg-white/5 rounded-lg">
                <div className="w-16 h-16 bg-carol-red/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-carol-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-playfair text-xl font-semibold mb-2">Pagamento Seguro</h3>
                <p className="text-gray-400 text-sm">
                  Diversas formas de pagamento seguras para sua comodidade.
                </p>
              </div>
              
              <div className="text-center p-6 bg-white/5 rounded-lg">
                <div className="w-16 h-16 bg-carol-red/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-carol-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <h3 className="font-playfair text-xl font-semibold mb-2">Atendimento Premium</h3>
                <p className="text-gray-400 text-sm">
                  Equipe especializada para ajudar em todas as suas dúvidas.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
