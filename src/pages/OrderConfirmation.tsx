
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Check, Truck, Calendar, Clock } from 'lucide-react';

const OrderConfirmation = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrder = async () => {
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
        console.error('Error fetching order:', error);
        setError("Erro ao carregar informações do pedido");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, user]);

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
              <Link to="/">Voltar para início</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const orderDate = new Date(order.created_at).toLocaleDateString('pt-BR');
  const estimatedDeliveryDate = new Date();
  estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 7);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border p-8 mb-6">
              <div className="text-center mb-8">
                <div className="mx-auto bg-green-100 rounded-full h-24 w-24 flex items-center justify-center mb-4">
                  <Check className="h-12 w-12 text-green-600" strokeWidth={3} />
                </div>
                <h1 className="font-playfair text-3xl font-bold mb-2">Pedido Confirmado!</h1>
                <p className="text-lg text-gray-600">
                  Seu pedido #{order.id.slice(0, 8)} foi recebido e está sendo processado.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center mb-2">
                    <Calendar className="h-5 w-5 text-carol-red mr-2" />
                    <h3 className="font-medium">Data do Pedido</h3>
                  </div>
                  <p className="text-gray-600">{orderDate}</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center mb-2">
                    <Truck className="h-5 w-5 text-carol-red mr-2" />
                    <h3 className="font-medium">Endereço de Entrega</h3>
                  </div>
                  <p className="text-gray-600">
                    {order.shipping_address}, {order.shipping_city}, {order.shipping_state}, {order.shipping_zip_code}
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center mb-2">
                    <Clock className="h-5 w-5 text-carol-red mr-2" />
                    <h3 className="font-medium">Status</h3>
                  </div>
                  <p className="text-gray-600 capitalize">{order.status}</p>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="font-semibold text-xl mb-4">Resumo do Pedido</h2>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-50 text-left">
                      <tr>
                        <th className="px-4 py-2 text-sm font-medium text-gray-500">Produto</th>
                        <th className="px-4 py-2 text-sm font-medium text-gray-500">Preço</th>
                        <th className="px-4 py-2 text-sm font-medium text-gray-500">Qtd</th>
                        <th className="px-4 py-2 text-sm font-medium text-gray-500 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0 rounded-md overflow-hidden mr-3">
                                <img
                                  src={item.product?.image_url || 'https://via.placeholder.com/60'}
                                  alt={item.product?.name}
                                  className="h-full w-full object-cover object-center"
                                />
                              </div>
                              <span>{item.product?.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">R$ {item.price.toFixed(2).replace('.', ',')}</td>
                          <td className="px-4 py-3">{item.quantity}</td>
                          <td className="px-4 py-3 text-right">
                            R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={2} className="px-4 py-3"></td>
                        <td className="px-4 py-3 font-medium">Subtotal</td>
                        <td className="px-4 py-3 text-right">
                          R$ {(order.total - order.shipping_fee).toFixed(2).replace('.', ',')}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2} className="px-4 py-3"></td>
                        <td className="px-4 py-3 font-medium">Frete</td>
                        <td className="px-4 py-3 text-right">
                          R$ {order.shipping_fee.toFixed(2).replace('.', ',')}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2} className="px-4 py-3"></td>
                        <td className="px-4 py-3 font-bold">Total</td>
                        <td className="px-4 py-3 text-right font-bold">
                          R$ {order.total.toFixed(2).replace('.', ',')}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div className="text-center space-y-4">
                <p className="text-gray-600">
                  Um e-mail de confirmação foi enviado para a sua conta cadastrada.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button asChild>
                    <Link to="/meus-pedidos">Ver meus pedidos</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/">Continuar comprando</Link>
                  </Button>
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

export default OrderConfirmation;
