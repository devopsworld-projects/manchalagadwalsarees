import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProductCard } from './ProductCard';

export function NewCollections() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: newProducts = [] } = useQuery({
    queryKey: ['storefront-new-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .eq('is_new', true)
        .order('created_at', { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    },
  });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  if (newProducts.length === 0) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-10">
          <span className="inline-block text-xs tracking-[0.2em] font-body text-muted-foreground border border-border px-4 py-1.5 mb-4 uppercase">
            New Arrivals
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            New Collections
          </h2>
        </div>

        <div className="relative">
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/90 backdrop-blur border border-border rounded-full p-2 shadow-sm hover:shadow-md transition-shadow hidden md:block"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/90 backdrop-blur border border-border rounded-full p-2 shadow-sm hover:shadow-md transition-shadow hidden md:block"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x"
          >
            {newProducts.map(product => (
              <div key={product.id} className="min-w-[48vw] sm:min-w-[220px] md:min-w-[260px] snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
