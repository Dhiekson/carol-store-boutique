
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
  TruckDelivery,
  BarChart4,
  CreditCard
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
    title: 'Frete',
    href: '/admin/frete',
    icon: <TruckDelivery size={20} />,
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
    <div className="flex flex-col h-full bg-white border-r">
      <div className="p-4 border-b">
        <Link to="/admin/dashboard" className="flex items-center">
          <h1 className="font-playfair font-bold text-xl text-carol-red">
            Carol<span className="text-carol-black">Store</span>
            <span className="text-xs ml-1 align-top">ADM</span>
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
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="border-t p-4">
        <Link
          to="/login"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors w-full"
        >
          <LogOut size={20} />
          Sair
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;
