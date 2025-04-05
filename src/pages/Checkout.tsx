
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { CreditCard, Truck } from 'lucide-react';

const Checkout = () => {
  const { user, profile } = useAuth();
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [shipping, setShipping] = useState<any>(null);
  const [shippingMethods, setShippingMethods] = useState<any[]>([]);
  const [selectedShipping, setSelectedShipping] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: profile?.first_name || '',
    lastName: profile?.last_name || '',
    address: profile?.address || '',
    city: profile?.city || '',
    state: profile?.state || '',
    zipCode: profile?.zip_code || '',
    phone: profile?.phone || '',
    sameAsProfile: true,
    shippingAddress: profile?.address || '',
    shippingCity: profile?.city || '',
    shippingState: profile?.state || '',
    shippingZipCode: profile?.zip_code || '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/checkout');
      return;
    }

    if (cart.length === 0) {
      navigate('/carrinho');
      return;
    }

    // Fetch shipping methods
    const fetchShippingMethods = async () => {
      try {
        const { data, error } = await supabase
          .from('shipping_methods')
          .select('*')
          .eq('active', true);

        if (error) {
          throw error;
        }

        setShippingMethods(data);
        if (data && data.length > 0) {
          setSelectedShipping(data[0].id);
          setShipping(data[0]);
        }
      } catch (error) {
        console.error('Error fetching shipping methods:', error);
      }
    };

    fetchShippingMethods();
  }, [user, navigate, cart, profile]);

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        address: profile.address || '',
        city: profile.city || '',
        state: profile.state || '',
        zipCode: profile.zip_code || '',
        phone: profile.phone || '',
        sameAsProfile: true,
        shippingAddress: profile.address || '',
        shippingCity: profile.city || '',
        shippingState: profile.state || '',
        shippingZipCode: profile.zip_code || '',
      });
    }
  }, [profile]);

  useEffect(() => {
    if (formData.sameAsProfile) {
      setFormData({
        ...formData,
        shippingAddress: formData.address,
        shippingCity: formData.city,
        shippingState: formData.state,
        shippingZipCode: formData.zipCode,
      });
    }
  }, [formData.sameAsProfile, formData.address, formData.city, formData.state, formData.zipCode]);

  useEffect(() => {
    if (selectedShipping) {
      const selected = shippingMethods.find(method => method.id === selectedShipping);
      setShipping(selected);
    }
  }, [selectedShipping, shippingMethods]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({
      ...formData,
      sameAsProfile: checked,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !profile || cart.length === 0 || !shipping) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // Update profile info
      await supabase
        .from('profiles')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zipCode,
          phone: formData.phone,
        })
        .eq('id', user.id);

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          status: 'pending',
          total: cartTotal + (shipping?.base_price || 0),
          shipping_fee: shipping?.base_price || 0,
          shipping_address: formData.shippingAddress,
          shipping_city: formData.shippingCity,
          shipping_state: formData.shippingState,
          shipping_zip_code: formData.shippingZipCode,
          payment_method: paymentMethod,
        })
        .select()
        .single();

      if (orderError) {
        throw orderError;
      }

      // Create order items
      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product.discount_price || item.product.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        throw itemsError;
      }

      // Clear cart
      await clearCart();

      toast({
        title: "Pedido realizado com sucesso!",
        description: "Seu pedido foi recebido e está sendo processado.",
      });

      // Redirect to confirmation page
      navigate(`/confirmacao-pedido/${order.id}`);
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao finalizar seu pedido. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="font-playfair text-3xl font-bold mb-8">
            Finalizar <span className="text-carol-red">Compra</span>
          </h1>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Customer Information */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-6">Informações Pessoais</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nome</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Sobrenome</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <h3 className="text-lg font-medium mt-6 mb-4">Endereço de Cobrança</h3>
                
                <div className="space-y-2 mb-4">
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">CEP</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sameAsProfile"
                      checked={formData.sameAsProfile}
                      onCheckedChange={handleCheckboxChange}
                    />
                    <label
                      htmlFor="sameAsProfile"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Usar mesmo endereço para entrega
                    </label>
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              {!formData.sameAsProfile && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-xl font-semibold mb-6">Endereço de Entrega</h2>
                  
                  <div className="space-y-2 mb-4">
                    <Label htmlFor="shippingAddress">Endereço</Label>
                    <Input
                      id="shippingAddress"
                      name="shippingAddress"
                      value={formData.shippingAddress}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="shippingCity">Cidade</Label>
                      <Input
                        id="shippingCity"
                        name="shippingCity"
                        value={formData.shippingCity}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shippingState">Estado</Label>
                      <Input
                        id="shippingState"
                        name="shippingState"
                        value={formData.shippingState}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shippingZipCode">CEP</Label>
                      <Input
                        id="shippingZipCode"
                        name="shippingZipCode"
                        value={formData.shippingZipCode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Shipping Method */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-6">Método de Entrega</h2>
                
                <RadioGroup
                  value={selectedShipping}
                  onValueChange={setSelectedShipping}
                  className="space-y-4"
                >
                  {shippingMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`flex items-center justify-between border rounded-lg p-4 cursor-pointer ${
                        selectedShipping === method.id ? "border-carol-red bg-carol-red/5" : ""
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={method.id} id={`shipping-${method.id}`} />
                        <div>
                          <Label htmlFor={`shipping-${method.id}`} className="font-medium">
                            {method.name}
                          </Label>
                          <p className="text-sm text-gray-500">
                            {method.description} - {method.estimated_days}
                          </p>
                        </div>
                      </div>
                      <div className="font-semibold">
                        R$ {method.base_price.toFixed(2).replace('.', ',')}
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-6">Método de Pagamento</h2>
                
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="space-y-4"
                >
                  <div
                    className={`flex items-center justify-between border rounded-lg p-4 cursor-pointer ${
                      paymentMethod === "credit_card" ? "border-carol-red bg-carol-red/5" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="credit_card" id="payment-card" />
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 mr-2" />
                        <Label htmlFor="payment-card" className="font-medium">
                          Cartão de Crédito
                        </Label>
                      </div>
                    </div>
                  </div>
                  
                  <div
                    className={`flex items-center justify-between border rounded-lg p-4 cursor-pointer ${
                      paymentMethod === "pix" ? "border-carol-red bg-carol-red/5" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pix" id="payment-pix" />
                      <div className="flex items-center">
                        <div className="bg-gray-200 text-gray-800 rounded p-1 mr-2 font-bold text-xs">
                          PIX
                        </div>
                        <Label htmlFor="payment-pix" className="font-medium">
                          Pix
                        </Label>
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-6">Resumo do Pedido</h2>
                
                <div className="space-y-4 mb-6">
                  {cart.map((item) => {
                    const productPrice = item.product.discount_price || item.product.price;
                    const subtotal = productPrice * item.quantity;
                    
                    return (
                      <div key={item.id} className="flex justify-between">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 rounded-md overflow-hidden mr-3">
                            <img
                              src={item.product.image_url || 'https://via.placeholder.com/60'}
                              alt={item.product.name}
                              className="h-full w-full object-cover object-center"
                            />
                          </div>
                          <div>
                            <div className="font-medium">{item.product.name}</div>
                            <div className="text-sm text-gray-500">Qtd: {item.quantity}</div>
                          </div>
                        </div>
                        <div className="font-medium">
                          R$ {subtotal.toFixed(2).replace('.', ',')}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="space-y-2 py-4 border-t">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frete</span>
                    <span>R$ {(shipping?.base_price || 0).toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
                
                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between font-bold text-xl">
                    <span>Total</span>
                    <span>R$ {(cartTotal + (shipping?.base_price || 0)).toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1 flex items-center">
                    <Truck className="h-4 w-4 mr-1" />
                    <span>Previsão de entrega: {shipping?.estimated_days}</span>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-carol-red hover:bg-carol-red/90"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processando...
                    </span>
                  ) : (
                    "Finalizar Pedido"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
