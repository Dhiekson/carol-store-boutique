
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Share2, Star, Minus, Plus } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) {
          throw error;
        }
        
        setProduct(data);
        
        // Fetch related products
        if (data) {
          const { data: related, error: relatedError } = await supabase
            .from('products')
            .select('*')
            .eq('category', data.category)
            .neq('id', id)
            .limit(4);
            
          if (!relatedError && related) {
            setRelatedProducts(related);
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as informações do produto.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, toast]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product.id, quantity);
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

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold mb-4">Produto não encontrado</h1>
            <p className="mb-8">O produto que você está procurando não está disponível.</p>
            <Button asChild className="bg-carol-red hover:bg-carol-red/90">
              <Link to="/produtos">Voltar para produtos</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <div className="mb-6 text-sm">
            <Link to="/" className="text-gray-500 hover:text-carol-red">Início</Link>
            <span className="mx-2">›</span>
            <Link to="/produtos" className="text-gray-500 hover:text-carol-red">Produtos</Link>
            <span className="mx-2">›</span>
            <Link to={`/produtos?categoria=${product.category}`} className="text-gray-500 hover:text-carol-red">
              {product.category}
            </Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Product Images */}
            <div>
              <div className="bg-gray-100 rounded-lg overflow-hidden h-[500px] flex items-center justify-center">
                <img
                  src={product.image_url || "https://via.placeholder.com/500"}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            {/* Product Info */}
            <div>
              <h1 className="font-playfair text-3xl font-bold mb-2">{product.name}</h1>
              
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-4 w-4"
                      fill={star <= 4 ? "currentColor" : "none"}
                      color={star <= 4 ? "#FFC107" : "#E2E8F0"}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">(12 avaliações)</span>
              </div>

              <div className="mb-6">
                {product.discount_price ? (
                  <div className="flex items-center">
                    <span className="text-3xl font-bold text-carol-red">
                      R$ {product.discount_price.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="ml-2 text-gray-500 line-through">
                      R$ {product.price.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="ml-2 bg-carol-red/10 text-carol-red text-xs font-medium px-2 py-1 rounded">
                      {Math.round(((product.price - product.discount_price) / product.price) * 100)}% OFF
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold">
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </span>
                )}
              </div>

              <div className="border-t border-b py-6 mb-6">
                <p className="text-gray-700 mb-4">
                  {product.description || "Sem descrição disponível."}
                </p>
                
                <div className="flex items-center mt-4">
                  <div className="text-sm text-gray-500">
                    <span className="font-medium text-gray-700">Categoria:</span> {product.category}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="mr-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantidade
                    </label>
                    <div className="flex items-center border rounded-md">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10"
                        onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="mx-4 w-8 text-center">{quantity}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Disponibilidade
                    </label>
                    <div className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock > 0 ? 'Em estoque' : 'Esgotado'}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <Button
                    className="bg-carol-red hover:bg-carol-red/90 flex-1"
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Adicionar ao carrinho
                  </Button>
                  
                  <Button variant="outline" size="icon" className="h-12 w-12">
                    <Heart className="h-5 w-5" />
                  </Button>
                  
                  <Button variant="outline" size="icon" className="h-12 w-12">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="font-playfair text-2xl font-bold mb-6">
                Produtos <span className="text-carol-red">Relacionados</span>
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <div key={relatedProduct.id} className="bg-white rounded-lg shadow-sm overflow-hidden border">
                    <Link to={`/produto/${relatedProduct.id}`}>
                      <div className="h-64 overflow-hidden">
                        <img
                          src={relatedProduct.image_url || "https://via.placeholder.com/300"}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-lg hover:text-carol-red transition-colors">
                          {relatedProduct.name}
                        </h3>
                        <p className="text-sm text-gray-500">{relatedProduct.category}</p>
                        <div className="mt-2">
                          {relatedProduct.discount_price ? (
                            <div className="flex items-center">
                              <span className="font-bold">
                                R$ {relatedProduct.discount_price.toFixed(2).replace('.', ',')}
                              </span>
                              <span className="ml-2 text-sm text-gray-500 line-through">
                                R$ {relatedProduct.price.toFixed(2).replace('.', ',')}
                              </span>
                            </div>
                          ) : (
                            <span className="font-bold">
                              R$ {relatedProduct.price.toFixed(2).replace('.', ',')}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
