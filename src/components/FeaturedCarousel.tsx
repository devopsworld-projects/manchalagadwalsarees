import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProductCard } from './ProductCard';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function FeaturedCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['storefront-featured-carousel'],
    queryFn: async () => {
      // Prefer best sellers; fall back to newest active products
      const { data: best } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .eq('is_best_seller', true)
        .order('created_at', { ascending: false })
        .limit(10);
      if (best && best.length >= 4) return best;
      const { data: newest } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(10);
      return newest || [];
    },
  });

  if (isLoading || products.length === 0) return null;

  const scrollBy = (delta: number) => {
    scrollerRef.current?.scrollBy({ left: delta, behavior: 'smooth' });
  };

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-cream">
      <div className="absolute top-0 left-0 right-0 ornate-line" />

      <div className="container relative z-10">
        <div className="flex items-end justify-between mb-10 gap-6">
          <div>
            <span className="text-accent text-[8px] tracking-[0.5em] block">◆&nbsp;&nbsp;HANDPICKED&nbsp;&nbsp;◆</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-primary mt-3 tracking-wide">
              Featured Sarees
            </h2>
            <p className="font-serif text-muted-foreground mt-2 text-base md:text-lg italic max-w-xl">
              A curated selection of our most exquisite Gadwal silks — handwoven by master artisans of Telangana.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2 shrink-0">
            <button
              onClick={() => scrollBy(-340)}
              aria-label="Previous"
              className="h-11 w-11 border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scrollBy(340)}
              aria-label="Next"
              className="h-11 w-11 border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4 pb-2"
          style={{ scrollbarWidth: 'none' }}
        >
          {products.map(product => (
            <div
              key={product.id}
              className="snap-start shrink-0 w-[60%] sm:w-[42%] md:w-[30%] lg:w-[23%]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/collections"
            className="relative inline-block border border-accent text-accent px-12 py-4 text-[11px] tracking-[0.25em] font-display hover:bg-accent hover:text-accent-foreground transition-all uppercase"
          >
            Explore Full Collection
            <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary" />
            <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-primary" />
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 ornate-line" />
    </section>
  );
}
