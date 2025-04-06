
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Truck, Calendar, MapPin, CreditCard } from 'lucide-react';

const OrderDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!user || !id) {
        setError("Acesso não autorizado");
        setLoading(false);
        return;
      }

      try {
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (orderError) {
          throw orderError;
        }

        setOrder(orderData);

        // Fetch order items
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select(`
            *,
            product:product_id (
              id, name, price, image_url, category
            )
          `)
          .eq('order_id', id);

        if (itemsError) {
          throw itemsError;
        }

        setItems(itemsData);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError("Erro ao carregar informações do pedido");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'processing':
        return 'Processando';
      case 'shipped':
        return 'Enviado';
      case 'delivered':
        return 'Entregue';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-carol-red"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold mb-4">Pedido não encontrado</h1>
            <p className="mb-8">{error || "O pedido que você está procurando não está disponível."}</p>
            <Button asChild className="bg-carol-red hover:bg-carol-red/90">
              <Link to="/meus-pedidos">Voltar para meus pedidos</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const orderDate = new Date(order.created_at).toLocaleDateString('pt-BR');

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-playfair text-3xl font-bold">
                Pedido <span className="text-carol-red">#{order.id.slice(0, 8)}</span>
              </h1>
              <Button variant="outline" size="sm" asChild>
                <Link to="/meus-pedidos">
                  <ChevronLeft className="h-4 w-4 mr-1" /> Voltar
                </Link>
              </Button>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-carol-red mr-2" />
                  <span className="font-medium">Pedido realizado em {orderDate}</span>
                </div>
                <span className={`inline-flex px-3 py-1 text-sm rounded-full ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center">
                    <MapPin className="h-4 w-4 text-carol-red mr-1" /> Endereço de entrega
                  </h3>
                  <p className="text-gray-600">
                    {order.shipping_address}<br />
                    {order.shipping_city}, {order.shipping_state}<br />
                    {order.shipping_zip_code}
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center">
                    <CreditCard className="h-4 w-4 text-carol-red mr-1" /> Método de pagamento
                  </h3>
                  <p className="text-gray-600 capitalize">
                    {order.payment_method}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-6">
              <h3 className="font-semibold text-lg px-6 py-4 border-b">Itens do Pedido</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <th className="px-6 py-3 text-sm font-medium text-gray-500">Produto</th>
                      <th className="px-6 py-3 text-sm font-medium text-gray-500">Preço</th>
                      <th className="px-6 py-3 text-sm font-medium text-gray-500">Quantidade</th>
                      <th className="px-6 py-3 text-sm font-medium text-gray-500 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-12 w-12 flex-shrink-0 rounded-md overflow-hidden mr-4">
                              <img
                                src={item.product?.image_url || 'https://via.placeholder.com/100'}
                                alt={item.product?.name}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                            <Link
                              to={`/produto/${item.product_id}`}
                              className="font-medium text-gray-900 hover:text-carol-red"
                            >
                              {item.product?.name}
                            </Link>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            R$ {item.price.toFixed(2).replace('.', ',')}
                          </div>
                        </td>
                        <td className="px-6 py-4">{item.quantity}</td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-medium">
                            R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold text-lg mb-4">Resumo</h3>
              
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Subtotal</dt>
                  <dd>
                    R$ {(order.total - order.shipping_fee).toFixed(2).replace('.', ',')}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Frete</dt>
                  <dd>
                    R$ {order.shipping_fee.toFixed(2).replace('.', ',')}
                  </dd>
                </div>
                <div className="flex justify-between pt-2 border-t font-medium text-base">
                  <dt>Total</dt>
                  <dd>
                    R$ {order.total.toFixed(2).replace('.', ',')}
                  </dd>
                </div>
              </dl>
              
              <div className="mt-6 border-t pt-6">
                <div className="flex items-center text-sm text-gray-600">
                  <Truck className="h-4 w-4 text-carol-red mr-2" />
                  {order.status === 'shipped' || order.status === 'delivered' ? (
                    <span>Seu pedido foi enviado e está a caminho!</span>
                  ) : (
                    <span>Seu pedido está sendo processado e será enviado em breve.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderDetail;
