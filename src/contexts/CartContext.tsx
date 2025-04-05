
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    discount_price?: number;
    image_url?: string;
    category: string;
  };
}

interface CartContextType {
  cart: CartItem[];
  isLoading: boolean;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Calculate cart totals
  const cartTotal = cart.reduce((total, item) => {
    const price = item.product.discount_price || item.product.price;
    return total + (price * item.quantity);
  }, 0);

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Fetch cart items when user changes
  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      setCart([]);
      setIsLoading(false);
    }
  }, [user]);

  const fetchCartItems = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('shopping_cart')
        .select(`
          *,
          product:product_id (
            id, name, price, discount_price, image_url, category
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching cart:', error);
        return;
      }

      setCart(data || []);
    } catch (err) {
      console.error('Error in fetchCartItems:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number) => {
    if (!user) {
      toast({
        title: "Necessário fazer login",
        description: "Faça login para adicionar produtos ao carrinho",
        variant: "destructive"
      });
      return;
    }

    try {
      // Check if product already in cart
      const existingItemIndex = cart.findIndex(item => item.product_id === productId);

      if (existingItemIndex >= 0) {
        // Update quantity if already in cart
        const newQuantity = cart[existingItemIndex].quantity + quantity;
        await updateQuantity(productId, newQuantity);
      } else {
        // Add new item to cart
        const { error } = await supabase
          .from('shopping_cart')
          .insert({
            user_id: user.id,
            product_id: productId,
            quantity
          });

        if (error) {
          console.error('Error adding to cart:', error);
          toast({
            title: "Erro ao adicionar ao carrinho",
            description: error.message,
            variant: "destructive"
          });
          return;
        }

        toast({
          title: "Produto adicionado",
          description: "Item adicionado ao carrinho com sucesso"
        });

        // Refresh cart
        fetchCartItems();
      }
    } catch (err) {
      console.error('Error in addToCart:', err);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user) return;

    try {
      if (quantity <= 0) {
        await removeFromCart(productId);
        return;
      }

      const { error } = await supabase
        .from('shopping_cart')
        .update({ quantity })
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) {
        console.error('Error updating quantity:', error);
        toast({
          title: "Erro ao atualizar carrinho",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      // Refresh cart
      fetchCartItems();
    } catch (err) {
      console.error('Error in updateQuantity:', err);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('shopping_cart')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) {
        console.error('Error removing from cart:', error);
        toast({
          title: "Erro ao remover do carrinho",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Item removido",
        description: "Produto removido do carrinho"
      });

      // Refresh cart
      fetchCartItems();
    } catch (err) {
      console.error('Error in removeFromCart:', err);
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('shopping_cart')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error clearing cart:', error);
        toast({
          title: "Erro ao limpar carrinho",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      setCart([]);
    } catch (err) {
      console.error('Error in clearCart:', err);
    }
  };

  const value = {
    cart,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
