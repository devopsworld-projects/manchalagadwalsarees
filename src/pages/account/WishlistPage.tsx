import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ProductCard } from '@/components/ProductCard';
import { Heart, Loader2 } from 'lucide-react';

export default function WishlistPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: wishlistProducts = [], isLoading } = useQuery({
    queryKey: ['wishlist-products', user?.id],
    queryFn: async () => {
      const { data: wishlistItems, error: wErr } = await supabase.from('wishlists').select('product_id').eq('user_id', user!.id);
      if (wErr) throw wErr;
      if (!wishlistItems.length) return [];
      const productIds = wishlistItems.map(w => w.product_id);
      const { data: products, error: pErr } = await supabase.from('products').select('*, categories(name, slug)').in('id', productIds);
      if (pErr) throw pErr;
      return products || [];
    },
    enabled: !!user,
  });

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <span className="text-accent text-[7px]">◆</span>
        <h2 className="font-display text-lg font-bold tracking-[0.1em] uppercase">My Wishlist</h2>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="text-center py-16 border border-border relative">
          <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-accent/20" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-accent/20" />
          <Heart className="h-10 w-10 text-accent/40 mx-auto mb-3" />
          <p className="font-display text-sm tracking-wider text-muted-foreground uppercase mb-4">Your wishlist is empty</p>
          <button onClick={() => navigate('/collections')} className="border border-primary text-primary px-6 py-2 font-display text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-primary hover:text-primary-foreground transition-colors">
            Browse Collections
          </button>
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
