import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProductCard } from './ProductCard';
import { Link } from 'react-router-dom';
import { SectionHeader } from './SectionHeader';
import { ScrollReveal } from './ScrollReveal';

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
      const amount = direction === 'left' ? -340 : 340;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  if (newProducts.length === 0) return null;

  return (
    <section className="pt-20 md:pt-32 pb-10 md:pb-16 relative">
      {/* Subtle kolam texture background */}
      <div className="absolute inset-0 kolam-texture opacity-50" />

      <div className="container relative z-10">
        <ScrollReveal>
          <SectionHeader
            align="left"
            eyebrow="Just Arrived"
            title="New Arrivals"
            subtitle="Freshly curated — the latest additions to our collection"
            actions={
              <>
                <button
                  onClick={() => scroll('left')}
                  className="w-11 h-11 border border-border flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => scroll('right')}
                  className="w-11 h-11 border border-border flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <Link
                  to="/collections?filter=new-arrivals"
                  className="ml-2 font-display text-[10px] tracking-[0.25em] text-accent border-b border-accent/40 hover:border-accent pb-1 uppercase transition-colors hidden md:block"
                >
                  View All
                </Link>
              </>
            }
          />
        </ScrollReveal>

        {/* Horizontal scroll */}
        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x"
        >
          {newProducts.map(product => (
            <div key={product.id} className="min-w-[48vw] sm:min-w-[240px] md:min-w-[280px] snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Mobile view all link */}
        <div className="text-center mt-10 md:hidden">
          <Link
            to="/collections?filter=new-arrivals"
            className="inline-block border border-accent text-accent px-10 py-3 text-[10px] tracking-[0.2em] font-display uppercase hover:bg-accent hover:text-accent-foreground transition-all"
          >
            View All New Arrivals
          </Link>
        </div>
      </div>
    </section>
  );
}
