
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Settings, 
  LogOut, 
  Package,
  Truck,
  BarChart4,
  CreditCard,
  Tags,
  UserPlus
} from 'lucide-react';

const menuItems = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: <LayoutDashboard size={20} />,
  },
  {
    title: 'Produtos',
    href: '/admin/produtos',
    icon: <ShoppingBag size={20} />,
  },
  {
    title: 'Categorias',
    href: '/admin/categorias',
    icon: <Tags size={20} />,
  },
  {
    title: 'Pedidos',
    href: '/admin/pedidos',
    icon: <Package size={20} />,
  },
  {
    title: 'Clientes',
    href: '/admin/clientes',
    icon: <Users size={20} />,
  },
  {
    title: 'Administradores',
    href: '/admin/administradores',
    icon: <UserPlus size={20} />,
  },
  {
    title: 'Frete',
    href: '/admin/frete',
    icon: <Truck size={20} />,
  },
  {
    title: 'Pagamentos',
    href: '/admin/pagamentos',
    icon: <CreditCard size={20} />,
  },
  {
    title: 'Relatórios',
    href: '/admin/relatorios',
    icon: <BarChart4 size={20} />,
  },
  {
    title: 'Configurações',
    href: '/admin/configuracoes',
    icon: <Settings size={20} />,
  },
];

const AdminSidebar = () => {
  const location = useLocation();
  
  return (
    <div className="flex flex-col h-full bg-carol-black border-r border-carol-red/20 fixed top-0 left-0 w-64 z-30">
      <div className="p-4 border-b border-carol-red/20">
        <Link to="/admin/dashboard" className="flex items-center">
          <h1 className="font-playfair font-bold text-xl text-carol-red">
            Carol<span className="text-white">Store</span>
            <span className="text-xs ml-1 align-top text-carol-red">ADM</span>
          </h1>
        </Link>
      </div>
      
      <div className="flex-1 overflow-auto py-4 px-2">
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                location.pathname === item.href
                  ? "bg-carol-red text-white font-medium"
                  : "text-gray-300 hover:bg-carol-red/10 hover:text-white"
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="border-t border-carol-red/20 p-4">
        <Link
          to="/login"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-carol-red hover:bg-carol-red/10 transition-colors w-full"
        >
          <LogOut size={20} />
          Sair
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;
