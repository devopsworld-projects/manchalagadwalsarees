import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ProductCard } from '@/components/ProductCard';
import { Heart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function WishlistPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: wishlistProducts = [], isLoading } = useQuery({
    queryKey: ['wishlist-products', user?.id],
    queryFn: async () => {
      const { data: wishlistItems, error: wErr } = await supabase
        .from('wishlists')
        .select('product_id')
        .eq('user_id', user!.id);
      if (wErr) throw wErr;
      if (!wishlistItems.length) return [];

      const productIds = wishlistItems.map(w => w.product_id);
      const { data: products, error: pErr } = await supabase
        .from('products')
        .select('*, categories(name, slug)')
        .in('id', productIds);
      if (pErr) throw pErr;
      return products || [];
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-display text-xl font-semibold mb-6">My Wishlist</h2>

      {wishlistProducts.length === 0 ? (
        <div className="text-center py-16 bg-muted/30 rounded-xl border border-border">
          <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="font-body text-muted-foreground mb-4">Your wishlist is empty</p>
          <Button onClick={() => navigate('/collections')} variant="outline" size="sm" className="font-body text-xs tracking-wider uppercase">
            Browse Collections
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {wishlistProducts.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
