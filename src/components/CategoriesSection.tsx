import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';


import kanjivaramImg from '@/assets/categories/kanjivaram.jpg';
import banarasiImg from '@/assets/categories/banarasi.jpg';
import softSilkImg from '@/assets/categories/soft-silk.jpg';
import cottonImg from '@/assets/categories/cotton.jpg';
import maggamImg from '@/assets/categories/maggam.jpg';
import powerloomImg from '@/assets/categories/powerloom.jpg';
import kalamkariImg from '@/assets/categories/kalamkari.jpg';
import mysoreSilkImg from '@/assets/categories/mysore-silk.jpg';
import sambalpuriImg from '@/assets/categories/sambalpuri.jpg';
import rawSilkImg from '@/assets/categories/raw-silk.jpg';

const categoryImages: Record<string, string> = {
  'kanjivaram-sarees': kanjivaramImg,
  'banarasi-sarees': banarasiImg,
  'soft-silk-sarees': softSilkImg,
  'maggam-sarees': maggamImg,
  'Powerloom Sarees': powerloomImg,
  'Pen Kalamkari': kalamkariImg,
  'kalamkari-sarees': kalamkariImg,
  'mysore-silk-sarees': mysoreSilkImg,
  'Mysore Silk Sarees': mysoreSilkImg,
  'sambalpuri-sarees': sambalpuriImg,
  'raw-silk-sarees': rawSilkImg,
  'Bangalore Silk Sarees': kanjivaramImg,
  'bengali-sarees': banarasiImg,
  'maheshwari-silk-sarees': softSilkImg,
  'maheshwari-cotton-sarees': cottonImg,
  'jaipur-cotton-sarees': cottonImg,
  'south-cotton-sarees': cottonImg,
  'dr-khadi-sarees': cottonImg,
  'block-printed-sarees': kalamkariImg,
  'madhubani-print-sarees': kalamkariImg,
  'office-wear-sarees': softSilkImg,
  'tamilnadu-sarees': kanjivaramImg,
};

export function CategoriesSection() {
  const [showAll, setShowAll] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const { data: categories = [] } = useQuery({
    queryKey: ['storefront-categories-with-count'],
    queryFn: async () => {
      const { data: cats, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      const { data: products } = await supabase
        .from('products')
        .select('category_id')
        .eq('is_active', true);
      const counts: Record<string, number> = {};
      products?.forEach(p => {
        if (p.category_id) counts[p.category_id] = (counts[p.category_id] || 0) + 1;
      });
      return (cats || []).map(c => ({ ...c, product_count: counts[c.id] || 0 }));
    },
  });

  // Show all categories (not just those with products) so the grid looks full
  if (categories.length === 0) return null;
  const displayed = showAll ? categories : categories.slice(0, 8);

  return (
    <section className="py-24 md:py-32 relative kolam-texture">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="lotus-divider mb-5">
            <span className="lotus" />
          </div>
          <p className="devanagari text-accent text-base md:text-lg mb-2">परम्परा संग्रहः</p>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mt-2 tracking-wide">
            Our Sacred Collections
          </h2>
          <div className="w-20 ornate-line mx-auto mt-5" />
          <p className="font-serif text-base md:text-lg text-muted-foreground mt-4 italic max-w-md mx-auto">
            {categories.length} curated traditions — woven across the looms of Bharat
          </p>
        </div>

        {/* Clean uniform grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {displayed.map((cat, i) => {
            return (
              <Link
                key={cat.id}
                to={`/collections?filter=${cat.slug}`}
                className="group relative overflow-hidden aspect-[3/4]"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <CategoryImage cat={cat} />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/30 to-transparent transition-opacity duration-500" />
                
                {/* Hover reveal border */}
                <div className="absolute inset-2 border border-accent/0 group-hover:border-accent/40 transition-all duration-500" />

                {/* Corner ornaments on hover */}
                <div className="absolute top-4 left-4 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-accent/60" />
                  <div className="absolute top-0 left-0 h-full w-[1px] bg-accent/60" />
                </div>
                <div className="absolute bottom-4 right-4 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute bottom-0 right-0 w-full h-[1px] bg-accent/60" />
                  <div className="absolute bottom-0 right-0 h-full w-[1px] bg-accent/60" />
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-[1px] bg-accent/60 group-hover:w-8 transition-all duration-500" />
                    <span className="text-[9px] font-body text-accent/70 tracking-[0.2em] uppercase">
                      {cat.product_count} {cat.product_count === 1 ? 'piece' : 'pieces'}
                    </span>
                  </div>
                  <h3 className="font-display text-sm md:text-base font-bold text-background tracking-[0.12em] uppercase group-hover:text-accent transition-colors duration-300">
                    {cat.name}
                  </h3>
                </div>

                {/* Bottom gold accent */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </Link>
            );
          })}
        </div>

        {categories.length > 8 && (
          <div className="text-center mt-14">
            <button
              onClick={() => setShowAll(!showAll)}
              className="relative font-display text-[11px] tracking-[0.3em] text-accent border border-accent px-14 py-4 hover:bg-accent hover:text-accent-foreground transition-all uppercase"
            >
              {showAll ? 'Show Less' : `View All ${categories.length} Categories`}
              <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary" />
              <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-primary" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function CategoryImage({ cat }: { cat: any }) {
  const localImg = categoryImages[cat.slug];
  const imgSrc = cat.image_url || localImg;
  if (imgSrc) {
    return (
      <img
        src={imgSrc}
        alt={cat.name}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
        width={640}
        height={800}
      />
    );
  }
  return <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />;
}
