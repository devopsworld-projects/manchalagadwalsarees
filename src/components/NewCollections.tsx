import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProductCard } from './ProductCard';
import { Link } from 'react-router-dom';
import { SectionHeader } from './SectionHeader';

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
      const amount = direction === 'left' ? -360 : 360;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  if (newProducts.length === 0) return null;

  return (
    <section className="py-28 md:py-40 relative">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <SectionHeader
            index="II"
            eyebrow="Just Arrived"
            title={
              <>
                New
                <br />
                <span className="italic font-serif font-normal text-accent">Arrivals</span>
              </>
            }
            subtitle="Freshly handed off the loom — the latest weaves to enter our atelier."
          />
          <div className="flex items-center gap-3 mb-14 md:mb-20">
            <button
              onClick={() => scroll('left')}
              className="w-12 h-12 border border-foreground/30 flex items-center justify-center hover:bg-foreground hover:text-background transition-all duration-500"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-12 h-12 border border-foreground/30 flex items-center justify-center hover:bg-foreground hover:text-background transition-all duration-500"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <Link
              to="/collections?filter=new-arrivals"
              className="link-luxe ml-4 font-display text-[10px] tracking-luxe text-accent uppercase hidden md:inline-block"
            >
              View All →
            </Link>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-5 md:gap-7 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x"
        >
          {newProducts.map(product => (
            <div key={product.id} className="min-w-[70vw] sm:min-w-[280px] md:min-w-[320px] lg:min-w-[360px] snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="text-center mt-12 md:hidden">
          <Link
            to="/collections?filter=new-arrivals"
            className="inline-block border border-accent text-accent px-12 py-4 text-[10px] tracking-luxe font-display uppercase hover:bg-accent hover:text-accent-foreground transition-all"
          >
            View All New Arrivals
          </Link>
        </div>
      </div>
    </section>
  );
}
