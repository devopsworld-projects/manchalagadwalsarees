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
    <section className="py-28 md:py-40 bg-secondary/40 relative">
      <div className="container">
        <SectionHeader
          index="V"
          eyebrow="Most Loved"
          title={
            <>
              The
              <br />
              <span className="italic font-serif font-normal text-accent">Bestsellers</span>
            </>
          }
          subtitle="The drapes our patrons cannot stop returning to."
          align="center"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {bestSellers.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-16">
          <Link
            to="/collections?filter=best-sellers"
            className="btn-luxe font-display text-[10px] tracking-luxe text-foreground border border-foreground/40 px-14 py-[18px] hover:bg-foreground hover:text-background transition-all uppercase"
          >
            View All Bestsellers
          </Link>
        </div>
      </div>
    </section>
  );
}
