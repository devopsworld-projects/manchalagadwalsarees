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
    <section className="py-24 md:py-32 relative">
      {/* Subtle kolam texture background */}
      <div className="absolute inset-0 kolam-texture opacity-50" />

      <div className="container relative z-10">
        {/* Header with navigation */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-accent text-[7px]">◆</span>
              <div className="w-10 h-[1px] bg-accent/40" />
              <span className="font-body text-[10px] tracking-[0.4em] uppercase text-accent">Just Arrived</span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground tracking-wide">
              New Arrivals
            </h2>
            <p className="font-serif text-muted-foreground mt-3 text-base italic">
              Freshly curated — the latest additions to our collection
            </p>
          </div>
          <div className="flex items-center gap-3">
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
              className="ml-3 font-display text-[10px] tracking-[0.2em] text-accent border-b border-accent/40 hover:border-accent pb-1 uppercase transition-colors hidden md:block"
            >
              View All
            </Link>
          </div>
        </div>

        {/* Horizontal scroll */}
        <div
          ref={scrollRef}
          className="flex gap-5 md:gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x"
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
