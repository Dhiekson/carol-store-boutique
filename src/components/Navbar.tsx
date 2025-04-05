
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, Menu, X, Search } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);
  
  const links = [
    { name: 'Início', path: '/' },
    { name: 'Produtos', path: '/produtos' },
    { name: 'Contato', path: '/contato' },
  ];
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className={`font-playfair font-bold text-2xl text-carol-red transition-all duration-300 ${isScrolled ? 'scale-90' : ''}`}>
              Carol<span className="text-carol-black">Store</span><span className="text-xs ml-1 align-top">UDI</span>
            </h1>
          </Link>
          
          {/* Desktop Nav */}
          {!isMobile && (
            <nav className="hidden md:flex items-center space-x-8">
              {links.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path}
                  className={`nav-link text-sm font-medium ${
                    isActive(link.path) ? 'text-carol-red after:w-full' : ''
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          )}
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-carol-black hover:text-carol-red hover:bg-accent/50"
              aria-label="Pesquisar"
            >
              <Search size={20} />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-carol-black hover:text-carol-red hover:bg-accent/50"
              aria-label="Minha conta"
              asChild
            >
              <Link to="/login">
                <User size={20} />
              </Link>
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-carol-black hover:text-carol-red hover:bg-accent/50 relative"
              aria-label="Carrinho de compras"
              asChild
            >
              <Link to="/carrinho">
                <ShoppingCart size={20} />
                <span className="absolute -top-1 -right-1 bg-carol-red rounded-full w-5 h-5 flex items-center justify-center text-white text-xs">
                  0
                </span>
              </Link>
            </Button>
            
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className="ml-2 text-carol-black hover:text-carol-red hover:bg-accent/50 md:hidden"
                aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
                onClick={toggleMenu}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            )}
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobile && isMenuOpen && (
          <nav className="md:hidden py-4 animate-fade-in">
            <ul className="flex flex-col space-y-4">
              {links.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className={`block px-2 py-1 text-lg font-medium ${
                      isActive(link.path) ? 'text-carol-red' : 'text-carol-black'
                    }`}
                    onClick={toggleMenu}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
