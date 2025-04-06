
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { OrderType, OrderItemType, ProductType } from '@/integrations/supabase/db-types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Package, ChevronLeft, Clock, MapPin, CreditCard } from 'lucide-react';

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [order, setOrder] = useState<OrderType | null>(null);
  const [orderItems, setOrderItems] = useState<(OrderItemType & { product: ProductType })[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!user || !id) return;

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

        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select(`
            *,
            product:products(*)
          `)
          .eq('order_id', id);

        if (itemsError) {
          throw itemsError;
        }

        setOrderItems(itemsData as (OrderItemType & { product: ProductType })[]);
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [user, id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-24 pb-16 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Pedido não encontrado</h2>
            <p className="text-gray-500 mb-6">O pedido que você está procurando não existe ou você não tem permissão para acessá-lo.</p>
            <Button
              className="bg-pink-500 hover:bg-pink-600 text-white"
              asChild
            >
              <Link to="/meus-pedidos">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Voltar para meus pedidos
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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

  const orderDate = new Date(order.created_at).toLocaleDateString('pt-BR');
  const orderTime = new Date(order.created_at).toLocaleTimeString('pt-BR');

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Link 
              to="/meus-pedidos" 
              className="inline-flex items-center text-pink-500 hover:text-pink-600"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              <span>Voltar para meus pedidos</span>
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="font-playfair text-2xl font-bold">
                Pedido <span className="text-pink-500">#{order.id.slice(0, 8)}</span>
              </h1>
              <span className={`inline-flex px-3 py-1 text-sm rounded-full ${getStatusColor(order.status)}`}>
                {getStatusText(order.status)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Data do pedido</p>
                  <p className="font-medium">{orderDate} às {orderTime}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Endereço de entrega</p>
                  <p className="font-medium">{order.shipping_address}</p>
                  <p className="text-sm">{order.shipping_city}, {order.shipping_state} - {order.shipping_zip_code}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CreditCard className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Método de pagamento</p>
                  <p className="font-medium">{order.payment_method}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Itens do pedido</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {orderItems.map((item) => (
                <div key={item.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="flex items-center mb-4 sm:mb-0">
                    <div className="h-16 w-16 rounded overflow-hidden bg-gray-100 mr-4">
                      {item.product.image_url ? (
                        <img 
                          src={item.product.image_url} 
                          alt={item.product.name} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gray-200">
                          <Package className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-sm text-gray-500">Quantidade: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      R$ {item.price.toFixed(2).replace('.', ',')}
                    </p>
                    <p className="text-sm text-gray-500">
                      Subtotal: R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal:</span>
              <span>R$ {(order.total - order.shipping_fee).toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Frete:</span>
              <span>R$ {order.shipping_fee.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="border-t border-dashed border-gray-200 my-3 pt-3 flex justify-between">
              <span className="font-semibold">Total:</span>
              <span className="font-semibold text-lg">
                R$ {order.total.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderDetail;
