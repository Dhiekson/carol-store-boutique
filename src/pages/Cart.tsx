
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cart, isLoading, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="font-playfair text-3xl font-bold mb-8">
            Seu <span className="text-carol-red">Carrinho</span>
          </h1>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-carol-red"></div>
            </div>
          ) : cart.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Seu carrinho está vazio</h2>
              <p className="text-gray-500 mb-6">Adicione produtos para continuar suas compras</p>
              <Button
                className="bg-carol-red hover:bg-carol-red/90"
                asChild
              >
                <Link to="/produtos">Ver produtos</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 text-left">
                        <tr>
                          <th className="px-6 py-4 text-sm font-medium text-gray-500">Produto</th>
                          <th className="px-6 py-4 text-sm font-medium text-gray-500">Preço</th>
                          <th className="px-6 py-4 text-sm font-medium text-gray-500">Quantidade</th>
                          <th className="px-6 py-4 text-sm font-medium text-gray-500">Subtotal</th>
                          <th className="px-6 py-4 text-sm font-medium text-gray-500 sr-only">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {cart.map((item) => {
                          const productPrice = item.product.discount_price || item.product.price;
                          const subtotal = productPrice * item.quantity;
                          
                          return (
                            <tr key={item.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
                                    <img
                                      src={item.product.image_url || 'https://via.placeholder.com/150'}
                                      alt={item.product.name}
                                      className="h-full w-full object-cover object-center"
                                    />
                                  </div>
                                  <div className="ml-4">
                                    <Link
                                      to={`/produto/${item.product_id}`}
                                      className="font-medium text-gray-900 hover:text-carol-red"
                                    >
                                      {item.product.name}
                                    </Link>
                                    <div className="text-sm text-gray-500">{item.product.category}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-gray-900">
                                  R$ {productPrice.toFixed(2).replace('.', ',')}
                                </div>
                                {item.product.discount_price && (
                                  <div className="text-xs text-gray-500 line-through">
                                    R$ {item.product.price.toFixed(2).replace('.', ',')}
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center border rounded-md w-28">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                  <span className="mx-2 w-8 text-center">{item.quantity}</span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="font-medium text-gray-900">
                                  R$ {subtotal.toFixed(2).replace('.', ',')}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-gray-500 hover:text-red-500"
                                  onClick={() => handleRemove(item.product_id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold mb-4">Resumo do pedido</h2>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Frete</span>
                      <span>Calculado no checkout</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                    </div>
                  </div>
                  
                  <Button
                    className="w-full bg-carol-red hover:bg-carol-red/90"
                    size="lg"
                    onClick={handleCheckout}
                  >
                    Finalizar compra
                  </Button>
                  
                  <div className="mt-4">
                    <Link
                      to="/produtos"
                      className="text-sm text-carol-red hover:text-carol-red/80 flex items-center justify-center"
                    >
                      Continuar comprando
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
