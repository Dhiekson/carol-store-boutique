
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Users,
  Package,
  CreditCard,
  TrendingUp,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const salesData = [
  { name: 'Jan', total: 2400 },
  { name: 'Fev', total: 1398 },
  { name: 'Mar', total: 9800 },
  { name: 'Abr', total: 3908 },
  { name: 'Mai', total: 4800 },
  { name: 'Jun', total: 3800 },
  { name: 'Jul', total: 4300 },
];

const categoryData = [
  { name: 'Vestidos', total: 4000 },
  { name: 'Calças', total: 3000 },
  { name: 'Saias', total: 2000 },
  { name: 'Blusas', total: 2780 },
  { name: 'Croped', total: 1890 },
  { name: 'Macacão', total: 2390 },
];

const MetricCard = ({ title, value, icon, trend, percent, description }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-full ${trend === 'up' ? 'bg-green-100' : trend === 'down' ? 'bg-rose-100' : 'bg-blue-100'}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {percent && (
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            <TrendingUp size={14} className={`mr-1 ${trend === 'up' ? 'text-green-500' : 'text-rose-500'}`} />
            <span className={trend === 'up' ? 'text-green-500' : 'text-rose-500'}>
              {percent}%
            </span>
            <span className="ml-1">{description}</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
};

const DashboardMetrics = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total de Clientes"
          value="2,840"
          icon={<Users size={18} className="text-blue-500" />}
          trend="up"
          percent="12"
          description="desde o último mês"
        />
        <MetricCard
          title="Pedidos"
          value="285"
          icon={<Package size={18} className="text-indigo-500" />}
          trend="up"
          percent="8"
          description="desde a semana passada"
        />
        <MetricCard
          title="Vendas"
          value="R$ 45.850,00"
          icon={<CreditCard size={18} className="text-green-500" />}
          trend="up"
          percent="18"
          description="desde o último mês"
        />
        <MetricCard
          title="Taxa de Conversão"
          value="3.2%"
          icon={<TrendingUp size={18} className="text-rose-500" />}
          trend="down"
          percent="4"
          description="desde a semana passada"
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Vendas Mensais</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ea384c" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ea384c" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#ea384c"
                    fillOpacity={1}
                    fill="url(#colorTotal)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Vendas por Categoria</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#000000e6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardMetrics;
