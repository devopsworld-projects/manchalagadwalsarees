import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export function useWishlist() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: wishlistIds = [], isLoading } = useQuery({
    queryKey: ['wishlist', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wishlists')
        .select('product_id')
        .eq('user_id', user!.id);
      if (error) throw error;
      return data.map(w => w.product_id);
    },
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase
        .from('wishlists')
        .insert({ user_id: user!.id, product_id: productId });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wishlist', user?.id] }),
  });

  const removeMutation = useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', user!.id)
        .eq('product_id', productId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wishlist', user?.id] }),
  });

  const toggleWishlist = (productId: string) => {
    if (!user) return false;
    if (wishlistIds.includes(productId)) {
      removeMutation.mutate(productId);
    } else {
      addMutation.mutate(productId);
    }
    return true;
  };

  const isWishlisted = (productId: string) => wishlistIds.includes(productId);

  return { wishlistIds, isWishlisted, toggleWishlist, isLoading, isLoggedIn: !!user };
}
