import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import { useCart, CartProduct } from '@/context/CartContext';
import { toast } from 'sonner';
import { PageMeta } from '@/components/PageMeta';

export default function Wishlist() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToCart } = useCart();

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Please login to view your wishlist');
      navigate('/login', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['wishlist-full', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wishlists')
        .select('id, product_id, created_at, products(id, sku, name, price, original_price, images, colors, description)')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const removeMutation = useMutation({
    mutationFn: async (wishlistId: string) => {
      const { error } = await supabase.from('wishlists').delete().eq('id', wishlistId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist-full', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['wishlist', user?.id] });
      toast.success('Removed from wishlist');
    },
  });

  const handleAddToCart = (product: any) => {
    const cartProduct: CartProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.original_price ?? undefined,
      image: product.images?.[0] || '/placeholder.svg',
      category: '',
      colors: product.colors ?? [],
      description: product.description ?? '',
    };
    addToCart(cartProduct);
  };

  if (!user) {
    return (
      <div className="min-h-screen">
        <PageMeta title="Wishlist" description="Save and revisit your favourite Manchala Gadwal silk sarees." canonicalPath="/wishlist" />
        <AnnouncementBar />
        <Navbar />
        <main className="container py-20 text-center">
          <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="font-display text-3xl font-bold mb-2">Your Wishlist</h1>
          <p className="text-muted-foreground font-body mb-6">Sign in to save and view your favourite sarees</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate('/login')} className="font-body tracking-wider uppercase text-xs">Sign In</Button>
            <Button variant="outline" onClick={() => navigate('/signup')} className="font-body tracking-wider uppercase text-xs">Create Account</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageMeta title="Wishlist" description="Your saved Manchala Gadwal silk sarees, ready when you are." canonicalPath="/wishlist" />
      <AnnouncementBar />
      <Navbar />
      <main className="container py-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-center mb-2">Your Wishlist</h1>
        <p className="text-center text-muted-foreground font-body mb-10">
          {isLoading ? 'Loading...' : `${items.length} saved items`}
        </p>

        {!isLoading && items.length === 0 && (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground font-body mb-6">Your wishlist is empty</p>
            <Button onClick={() => navigate('/collections')} variant="outline" className="font-body tracking-wider uppercase text-xs">
              Browse Collections
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => {
            const product = item.products as any;
            if (!product) return null;
            const image = product.images?.[0] || '/placeholder.svg';

            return (
              <div key={item.id} className="flex gap-4 bg-muted/30 rounded-lg p-4 border border-border">
                <Link to={`/product/${product.sku}`} className="shrink-0">
                  <div className="h-28 w-20 rounded overflow-hidden bg-muted">
                    <img src={image} alt={product.name} className="h-full w-full object-cover" />
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${product.sku}`}>
                    <h3 className="font-display text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-body font-bold text-sm">₹{product.price.toLocaleString()}</span>
                    {product.original_price && (
                      <span className="font-body text-xs text-muted-foreground line-through">
                        ₹{product.original_price.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Button
                      size="sm"
                      className="h-8 text-xs font-body tracking-wider uppercase gap-1.5"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingBag className="h-3 w-3" />
                      Add to Cart
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 text-muted-foreground hover:text-destructive"
                      onClick={() => removeMutation.mutate(item.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
