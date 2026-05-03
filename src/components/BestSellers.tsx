import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProductCard } from './ProductCard';
import { Link } from 'react-router-dom';
import { SectionHeader } from './SectionHeader';

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
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Two-tone background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-secondary/30" />
        <div className="absolute inset-0 kolam-texture" />
      </div>
      <div className="absolute top-0 left-0 right-0 ornate-line" />

      <div className="container relative z-10">
        {/* Centered header */}
        <div className="text-center mb-16">
          <span className="text-accent text-[8px] tracking-[0.5em]">◆&nbsp;&nbsp;◆&nbsp;&nbsp;◆</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-4 tracking-wide">
            Best Sellers
          </h2>
          <div className="w-20 ornate-line mx-auto mt-5" />
          <p className="font-serif text-muted-foreground mt-4 text-base md:text-lg italic">
            Most loved by our patrons — timeless pieces that define elegance
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {bestSellers.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-14">
          <Link
            to="/collections?filter=best-sellers"
            className="relative inline-block border border-accent text-accent px-14 py-4 text-[11px] tracking-[0.25em] font-display hover:bg-accent hover:text-accent-foreground transition-all uppercase"
          >
            View All Best Sellers
            <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary" />
            <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-primary" />
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 ornate-line" />
    </section>
  );
}
