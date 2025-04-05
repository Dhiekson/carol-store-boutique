
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-carol-black text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Column 1 - About */}
          <div>
            <h3 className="font-playfair text-xl mb-4 text-carol-red">CarolStoreUdi</h3>
            <p className="text-sm text-gray-300 mb-4">
              Loja especializada em moda feminina com as últimas tendências em vestidos, saias, calças e muito mais.
            </p>
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:text-carol-red hover:bg-white/10 rounded-full"
              >
                <Instagram size={18} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:text-carol-red hover:bg-white/10 rounded-full"
              >
                <Facebook size={18} />
              </Button>
            </div>
          </div>
          
          {/* Column 2 - Links */}
          <div>
            <h3 className="font-playfair text-xl mb-4 text-carol-red">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-300 hover:text-carol-red transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/produtos" className="text-gray-300 hover:text-carol-red transition-colors">
                  Produtos
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-gray-300 hover:text-carol-red transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <Link to="/politica-de-privacidade" className="text-gray-300 hover:text-carol-red transition-colors">
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 3 - Contact */}
          <div>
            <h3 className="font-playfair text-xl mb-4 text-carol-red">Contato</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center">
                <Phone size={16} className="mr-2 text-carol-red" />
                <span className="text-gray-300">(34) 9999-9999</span>
              </li>
              <li className="flex items-center">
                <Mail size={16} className="mr-2 text-carol-red" />
                <span className="text-gray-300">contato@carolstoreudi.com</span>
              </li>
              <li className="flex items-start">
                <MapPin size={16} className="mr-2 text-carol-red mt-1" />
                <span className="text-gray-300">
                  Av. Rondon Pacheco, 123<br />
                  Uberlândia, MG
                </span>
              </li>
            </ul>
          </div>
          
          {/* Column 4 - Newsletter */}
          <div>
            <h3 className="font-playfair text-xl mb-4 text-carol-red">Newsletter</h3>
            <p className="text-sm text-gray-300 mb-3">
              Inscreva-se para receber nossas novidades e promoções.
            </p>
            <div className="flex flex-col space-y-2">
              <Input 
                type="email" 
                placeholder="Seu email" 
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
              <Button className="bg-carol-red hover:bg-carol-red/80 text-white w-full">
                Inscrever
              </Button>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/10 text-center text-xs text-gray-400">
          <p>© {currentYear} CarolStoreUdi. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
