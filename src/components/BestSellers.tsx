import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProductCard } from './ProductCard';
import { Link } from 'react-router-dom';

export function BestSellers() {
  const { data: bestSellers = [] } = useQuery({
    queryKey: ['storefront-best-sellers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .eq('is_best_seller', true)
        .order('created_at', { ascending: false })
        .limit(8);
      if (error) throw error;
      return data;
    },
  });

  if (bestSellers.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-secondary/40 kolam-texture relative">
      <div className="absolute top-0 left-0 right-0 ornate-line" />

      <div className="container">
        <div className="text-center mb-14">
          <span className="text-accent text-[8px]">◆ ◆ ◆</span>
          <h2 className="font-display text-2xl md:text-4xl font-bold text-foreground mt-3 tracking-wide">
            Best Sellers
          </h2>
          <div className="w-20 ornate-line mx-auto mt-4" />
          <p className="font-serif text-muted-foreground mt-3 text-base italic">
            Most loved by our customers
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {bestSellers.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/collections?filter=best-sellers"
            className="inline-block border-2 border-primary text-primary px-12 py-3.5 text-xs tracking-[0.25em] font-display hover:bg-primary hover:text-primary-foreground transition-all uppercase"
          >
            View All
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 ornate-line" />
    </section>
  );
}
