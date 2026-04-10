import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProductCard } from '@/components/ProductCard';

interface RelatedProductsProps {
  productId: string;
  currentSku: string;
}

export function RelatedProducts({ productId, currentSku }: RelatedProductsProps) {
  const { data: relatedProducts } = useQuery({
    queryKey: ['related-products', productId],
    queryFn: async () => {
      // First try explicit related_products table
      const { data: relations } = await supabase
        .from('related_products')
        .select('related_product_id')
        .eq('product_id', productId);

      const relatedIds = relations?.map(r => r.related_product_id) || [];

      if (relatedIds.length > 0) {
        const { data } = await supabase
          .from('products')
          .select('*, categories(name)')
          .in('id', relatedIds)
          .eq('is_active', true)
          .limit(4);
        return data || [];
      }

      // Fallback: same category products
      const { data: current } = await supabase
        .from('products')
        .select('category_id')
        .eq('id', productId)
        .single();

      if (current?.category_id) {
        const { data } = await supabase
          .from('products')
          .select('*, categories(name)')
          .eq('category_id', current.category_id)
          .eq('is_active', true)
          .neq('id', productId)
          .limit(4);
        return data || [];
      }

      // Final fallback: random active products
      const { data } = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('is_active', true)
        .neq('id', productId)
        .limit(4);
      return data || [];
    },
    enabled: !!productId,
  });

  if (!relatedProducts || relatedProducts.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="font-display text-2xl font-bold mb-6 text-center">You May Also Like</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {relatedProducts.map((product: any) => (
          <ProductCard
            key={product.id}
            id={product.sku}
            name={product.name}
            price={product.price}
            originalPrice={product.original_price}
            image={product.images?.[0] || '/placeholder.svg'}
            category={(product as any).categories?.name || ''}
            colors={product.colors || []}
            isNew={product.is_new}
            isBestSeller={product.is_best_seller}
          />
        ))}
      </div>
    </section>
  );
}
