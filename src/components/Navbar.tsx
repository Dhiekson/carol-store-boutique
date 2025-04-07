
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Search, 
  LogOut,
  UserCircle
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/produtos?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };
  
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
            <form onSubmit={handleSearch} className="relative hidden md:block">
              <Input 
                type="text"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-40 lg:w-60 pl-8 h-9"
              />
              <Button 
                type="submit" 
                size="icon" 
                variant="ghost" 
                className="absolute left-0 top-0 h-9 w-9 hover:bg-transparent"
              >
                <Search size={16} className="text-gray-500" />
              </Button>
            </form>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/produtos?search=' + encodeURIComponent(searchQuery))}
              className="text-carol-black hover:text-carol-red hover:bg-accent/50 md:hidden"
              aria-label="Pesquisar"
            >
              <Search size={20} />
            </Button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-carol-black hover:text-carol-red hover:bg-accent/50 relative"
                    aria-label="Minha conta"
                  >
                    <UserCircle size={20} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>
                    {profile?.first_name ? `Olá, ${profile.first_name}` : 'Minha conta'}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {profile?.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin/dashboard" className="w-full cursor-pointer">
                        Painel do Admin
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/perfil" className="w-full cursor-pointer">
                      Meu Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/meus-pedidos" className="w-full cursor-pointer">
                      Meus Pedidos
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                    <LogOut size={16} className="mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
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
            )}
            
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
        
        {/* Mobile Search (shown when menu is open) */}
        {isMobile && isMenuOpen && (
          <div className="mt-4 mb-2">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input 
                type="text"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit">
                <Search size={16} />
              </Button>
            </form>
          </div>
        )}
        
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
              
              {user && (
                <>
                  <li>
                    <Link
                      to="/perfil"
                      className="block px-2 py-1 text-lg font-medium text-carol-black"
                      onClick={toggleMenu}
                    >
                      Meu Perfil
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/meus-pedidos"
                      className="block px-2 py-1 text-lg font-medium text-carol-black"
                      onClick={toggleMenu}
                    >
                      Meus Pedidos
                    </Link>
                  </li>
                  {profile?.role === 'admin' && (
                    <li>
                      <Link
                        to="/admin/dashboard"
                        className="block px-2 py-1 text-lg font-medium text-carol-black"
                        onClick={toggleMenu}
                      >
                        Painel do Admin
                      </Link>
                    </li>
                  )}
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block px-2 py-1 text-lg font-medium text-carol-red flex items-center gap-2"
                    >
                      <LogOut size={18} /> Sair
                    </button>
                  </li>
                </>
              )}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
