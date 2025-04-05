
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const recentOrders = [
  {
    id: '34029',
    customer: 'Ana Silva',
    status: 'completed',
    date: '24/06/2023',
    total: 'R$ 259,90',
    items: 3,
  },
  {
    id: '34028',
    customer: 'João Oliveira',
    status: 'processing',
    date: '24/06/2023',
    total: 'R$ 189,50',
    items: 2,
  },
  {
    id: '34027',
    customer: 'Maria Santos',
    status: 'shipped',
    date: '23/06/2023',
    total: 'R$ 432,00',
    items: 5,
  },
  {
    id: '34026',
    customer: 'Pedro Costa',
    status: 'pending',
    date: '23/06/2023',
    total: 'R$ 129,90',
    items: 1,
  },
  {
    id: '34025',
    customer: 'Camila Alves',
    status: 'completed',
    date: '22/06/2023',
    total: 'R$ 345,70',
    items: 4,
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500 hover:bg-green-600';
    case 'processing':
      return 'bg-blue-500 hover:bg-blue-600';
    case 'shipped':
      return 'bg-purple-500 hover:bg-purple-600';
    case 'pending':
      return 'bg-amber-500 hover:bg-amber-600';
    case 'cancelled':
      return 'bg-red-500 hover:bg-red-600';
    default:
      return 'bg-gray-500 hover:bg-gray-600';
  }
};

const getStatusText = (status) => {
  const statusMap = {
    completed: 'Concluído',
    processing: 'Processando',
    shipped: 'Enviado',
    pending: 'Pendente',
    cancelled: 'Cancelado',
  };
  
  return statusMap[status] || status;
};

const RecentOrders = () => {
  return (
    <Card>
      <CardHeader className="flex justify-between items-start">
        <div>
          <CardTitle>Pedidos Recentes</CardTitle>
          <CardDescription>Acompanhe os últimos pedidos realizados</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <a href="/admin/pedidos">Ver todos</a>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="p-2 pb-3 text-sm font-medium text-muted-foreground">ID</th>
                <th className="p-2 pb-3 text-sm font-medium text-muted-foreground">Cliente</th>
                <th className="p-2 pb-3 text-sm font-medium text-muted-foreground">Status</th>
                <th className="p-2 pb-3 text-sm font-medium text-muted-foreground">Data</th>
                <th className="p-2 pb-3 text-sm font-medium text-muted-foreground">Itens</th>
                <th className="p-2 pb-3 text-sm font-medium text-muted-foreground text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-muted/30">
                  <td className="p-2 text-sm">#{order.id}</td>
                  <td className="p-2 text-sm font-medium">{order.customer}</td>
                  <td className="p-2 text-sm">
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                  </td>
                  <td className="p-2 text-sm">{order.date}</td>
                  <td className="p-2 text-sm">{order.items}</td>
                  <td className="p-2 text-sm font-semibold text-right">{order.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentOrders;
