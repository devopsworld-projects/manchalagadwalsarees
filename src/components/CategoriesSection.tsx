import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';

import kanjivaramImg from '@/assets/categories/kanjivaram.jpg';
import banarasiImg from '@/assets/categories/banarasi.jpg';
import softSilkImg from '@/assets/categories/soft-silk.jpg';
import cottonImg from '@/assets/categories/cotton.jpg';
import linenImg from '@/assets/categories/linen.jpg';
import georgetteImg from '@/assets/categories/georgette.jpg';
import chiffonImg from '@/assets/categories/chiffon.jpg';
import weddingImg from '@/assets/categories/wedding.jpg';

const categoryImages: Record<string, string> = {
  'kanjivaram-sarees': kanjivaramImg,
  'banarasi-sarees': banarasiImg,
  'soft-silk-sarees': softSilkImg,
  'bengali-cotton-sarees': cottonImg,
  'jaipur-cotton-sarees': cottonImg,
  'south-cotton-sarees': cottonImg,
  'linen-sarees': linenImg,
  'georgette-sarees': georgetteImg,
  'chiffon-sarees': chiffonImg,
  'wedding-sarees': weddingImg,
  'bridal-collection': weddingImg,
};

export function CategoriesSection() {
  const [showAll, setShowAll] = useState(false);

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

  const withProducts = categories.filter(c => c.product_count > 0);
  if (withProducts.length === 0) return null;
  const displayed = showAll ? withProducts : withProducts.slice(0, 6);

  // Masonry-style layout: first item is featured (tall), rest in grid
  const featured = displayed[0];
  const rest = displayed.slice(1);

  return (
    <section className="py-20 md:py-28 relative">
      <div className="container">
        {/* Section header — left-aligned editorial style */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-[2px] bg-accent" />
              <span className="font-body text-[10px] tracking-[0.4em] uppercase text-accent">Curated Collections</span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground tracking-wide">
              Shop by Category
            </h2>
          </div>
          <p className="font-serif text-base text-muted-foreground italic max-w-sm">
            {withProducts.length} collections of India's finest handwoven traditions
          </p>
        </div>

        {/* Asymmetric masonry grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {/* Featured category — spans 2 rows on desktop */}
          {featured && (
            <Link
              to={`/collections?filter=${featured.slug}`}
              className="group relative col-span-2 md:col-span-1 md:row-span-2 overflow-hidden min-h-[300px] md:min-h-0"
            >
              <CategoryImage cat={featured} />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/30 to-transparent" />
              {/* Corner ornaments */}
              <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-accent/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-accent/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="font-body text-[9px] tracking-[0.3em] text-accent uppercase mb-2">Featured</p>
                <h3 className="font-display text-xl md:text-2xl font-bold text-white tracking-wider uppercase mb-2">
                  {featured.name}
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-[1px] bg-accent/60" />
                  <span className="text-[10px] font-body text-white/60 tracking-wider">
                    {featured.product_count} products
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* Rest of categories in compact cards */}
          {rest.map((cat) => (
            <Link
              key={cat.id}
              to={`/collections?filter=${cat.slug}`}
              className="group relative aspect-[4/5] overflow-hidden"
            >
              <CategoryImage cat={cat} />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/20 to-transparent group-hover:from-foreground/90 transition-all duration-500" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="font-display text-xs md:text-sm font-bold text-white tracking-[0.15em] uppercase mb-1">
                  {cat.name}
                </h3>
                <span className="text-[9px] font-body text-accent/70 tracking-wider">
                  {cat.product_count} {cat.product_count === 1 ? 'product' : 'products'}
                </span>
              </div>
              {/* Hover reveal line */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </Link>
          ))}
        </div>

        {withProducts.length > 6 && (
          <div className="text-center mt-10">
            <button
              onClick={() => setShowAll(!showAll)}
              className="font-display text-[11px] tracking-[0.3em] text-primary border-2 border-primary px-12 py-3.5 hover:bg-primary hover:text-primary-foreground transition-all uppercase"
            >
              {showAll ? 'Show Less' : `View All ${withProducts.length} Categories`}
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
