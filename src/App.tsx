
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";

import Index from "./pages/Index";
import Products from "./pages/Products";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/admin/Dashboard";
import NotFound from "./pages/NotFound";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import UserProfile from "./pages/UserProfile";
import UserOrders from "./pages/UserOrders";
import OrderDetail from "./pages/OrderDetail";
import AdminProducts from "./pages/admin/Products";
import AdminOrders from "./pages/admin/Orders";
import AdminCategories from "./pages/admin/Categories";
import Customers from "./pages/admin/Customers";
import Shipping from "./pages/admin/Shipping";
import Payments from "./pages/admin/Payments";
import Reports from "./pages/admin/Reports";
import Settings from "./pages/admin/Settings";
import Administrators from "./pages/admin/Administrators";
import ProductForm from "./pages/admin/ProductForm";
import CreateAdmin from "./pages/admin/CreateAdmin";
import FeaturedProducts from "./pages/FeaturedProducts";
import { useEffect } from "react";
import { supabase } from "./integrations/supabase/client";

// Create a storage bucket if it doesn't exist
const setupStorage = async () => {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === 'product-images');
    
    if (!bucketExists) {
      await supabase.storage.createBucket('product-images', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
      });
    }
  } catch (error) {
    console.error("Error setting up storage:", error);
  }
};

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    setupStorage();
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <CartProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/produtos" element={<Products />} />
                <Route path="/produtos/destaque" element={<FeaturedProducts />} />
                <Route path="/produto/:id" element={<ProductDetail />} />
                <Route path="/contato" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registrar" element={<Register />} />
                <Route path="/carrinho" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/confirmacao-pedido/:id" element={<OrderConfirmation />} />
                <Route path="/perfil" element={<UserProfile />} />
                <Route path="/meus-pedidos" element={<UserOrders />} />
                <Route path="/pedido/:id" element={<OrderDetail />} />
                
                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/produtos" element={<AdminProducts />} />
                <Route path="/admin/produtos/novo" element={<ProductForm />} />
                <Route path="/admin/produtos/:id" element={<ProductForm />} />
                <Route path="/admin/pedidos" element={<AdminOrders />} />
                <Route path="/admin/categorias" element={<AdminCategories />} />
                <Route path="/admin/clientes" element={<Customers />} />
                <Route path="/admin/administradores" element={<Administrators />} />
                <Route path="/admin/administradores/novo" element={<CreateAdmin />} />
                <Route path="/admin/frete" element={<Shipping />} />
                <Route path="/admin/pagamentos" element={<Payments />} />
                <Route path="/admin/relatorios" element={<Reports />} />
                <Route path="/admin/configuracoes" element={<Settings />} />
                
                {/* Catch-all route for 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </CartProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
