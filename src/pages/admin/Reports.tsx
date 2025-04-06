
import React, { useState } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Line, Bar, Pie } from 'recharts';
import { Download, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';

const Reports = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Dados de exemplo para os gráficos
  const salesData = [
    { name: 'Jan', value: 4000 },
    { name: 'Fev', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Abr', value: 2780 },
    { name: 'Mai', value: 1890 },
    { name: 'Jun', value: 2390 },
    { name: 'Jul', value: 3490 },
  ];
  
  const categoryData = [
    { name: 'Vestidos', value: 35 },
    { name: 'Blusas', value: 25 },
    { name: 'Calças', value: 20 },
    { name: 'Acessórios', value: 15 },
    { name: 'Sapatos', value: 5 },
  ];

  const CustomLineChart = () => (
    <div className="h-[300px] w-full">
      <div className="w-full h-full">
        <Line
          data={salesData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#ea384c" activeDot={{ r: 8 }} />
        </Line>
      </div>
    </div>
  );

  const CustomBarChart = () => (
    <div className="h-[300px] w-full">
      <div className="w-full h-full">
        <Bar
          data={salesData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#ea384c" />
        </Bar>
      </div>
    </div>
  );

  const CustomPieChart = () => (
    <div className="h-[300px] w-full">
      <div className="w-full h-full">
        <Pie
          data={categoryData}
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label
        >
          {categoryData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
      </div>
    </div>
  );

  const COLORS = ['#ea384c', '#ff6b81', '#c0142a', '#333333', '#f8f8f8'];

  // Import required components from recharts
  const { CartesianGrid, XAxis, YAxis, Tooltip, Legend, Cell } = recharts;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-grow p-8 ml-64">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Relatórios</h1>
          
          <div className="flex flex-wrap gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  {date ? format(date, 'dd/MM/yyyy') : 'Selecionar data'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Select defaultValue="month">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Diário</SelectItem>
                <SelectItem value="week">Semanal</SelectItem>
                <SelectItem value="month">Mensal</SelectItem>
                <SelectItem value="year">Anual</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Vendas Totais</CardTitle>
              <CardDescription>Este mês</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 27.350,00</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                +12% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Pedidos</CardTitle>
              <CardDescription>Este mês</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">158</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                +5% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Ticket Médio</CardTitle>
              <CardDescription>Este mês</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 173,10</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                +3% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="sales">
          <TabsList className="mb-6">
            <TabsTrigger value="sales">Vendas</TabsTrigger>
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="customers">Clientes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sales">
            <Card>
              <CardHeader>
                <CardTitle>Relatório de Vendas</CardTitle>
                <CardDescription>Análise de vendas ao longo do tempo</CardDescription>
              </CardHeader>
              <CardContent>
                <CustomLineChart />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="products">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Vendas por Categoria</CardTitle>
                  <CardDescription>Distribuição de vendas por categoria de produto</CardDescription>
                </CardHeader>
                <CardContent>
                  <CustomPieChart />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Produtos Mais Vendidos</CardTitle>
                  <CardDescription>Top produtos por quantidade vendida</CardDescription>
                </CardHeader>
                <CardContent>
                  <CustomBarChart />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="customers">
            <Card>
              <CardHeader>
                <CardTitle>Aquisição de Clientes</CardTitle>
                <CardDescription>Novos clientes por mês</CardDescription>
              </CardHeader>
              <CardContent>
                <CustomBarChart />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Reports;
