
import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  {
    id: 'vestidos',
    name: 'Vestidos',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZHJlc3N8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    count: 42
  },
  {
    id: 'saias',
    name: 'Saias',
    image: 'https://images.unsplash.com/photo-1577900232427-18219b8349cc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2tpcnR8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    count: 24
  },
  {
    id: 'calcas',
    name: 'Calças',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8d29tZW4lMjBqZWFuc3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
    count: 36
  },
  {
    id: 'blusas',
    name: 'Blusas',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8d29tZW4lMjB0b3B8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    count: 56
  }
];

const CategoryCard = ({ category }) => {
  return (
    <Link 
      to={`/produtos/${category.id}`}
      className="group relative overflow-hidden rounded-lg h-64 card-hover"
    >
      <div className="absolute inset-0 bg-black/40 z-10 transition-opacity duration-300 group-hover:bg-black/20"></div>
      <img 
        src={category.image} 
        alt={category.name} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white p-4">
        <h3 className="font-playfair text-2xl font-bold mb-1">{category.name}</h3>
        <p className="text-sm opacity-80">{category.count} produtos</p>
      </div>
    </Link>
  );
};

const Categories = () => {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-2">
            Nossas <span className="text-carol-red">Categorias</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Explore nossa variedade de categorias e encontre o seu estilo perfeito.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
