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
  const displayed = showAll ? withProducts : withProducts.slice(0, 8);

  return (
    <section className="py-20 md:py-28 kolam-texture relative">
      {/* Top ornate line */}
      <div className="absolute top-0 left-0 right-0 ornate-line" />

      <div className="container">
        <div className="text-center mb-14">
          <span className="text-accent text-[8px]">◆ ◆ ◆</span>
          <h2 className="font-display text-2xl md:text-4xl font-bold text-foreground mt-3 tracking-wide">
            Shop by Category
          </h2>
          <div className="w-20 ornate-line mx-auto mt-4" />
          <p className="font-body text-muted-foreground mt-4 text-sm tracking-wide">
            {withProducts.length} curated collections — find your perfect saree
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {displayed.map((cat) => {
            const localImg = categoryImages[cat.slug];
            const imgSrc = cat.image_url || localImg;
            return (
              <Link
                key={cat.id}
                to={`/collections?filter=${cat.slug}`}
                className="group relative aspect-[3/4] overflow-hidden temple-glow-hover"
              >
                {imgSrc ? (
                  <img
                    src={imgSrc}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    width={640}
                    height={800}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/10" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent" />

                {/* Temple corner accents */}
                <div className="absolute top-2 left-2 w-5 h-5 border-t border-l border-accent/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-2 right-2 w-5 h-5 border-b border-r border-accent/50 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-display text-sm md:text-base font-bold text-white leading-tight mb-1 tracking-wider uppercase">
                    {cat.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-[1px] bg-accent/60" />
                    <span className="text-[10px] font-body text-accent/80 tracking-wider">
                      {cat.product_count} {cat.product_count === 1 ? 'product' : 'products'}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {withProducts.length > 8 && (
          <div className="text-center mt-10">
            <button
              onClick={() => setShowAll(!showAll)}
              className="font-display text-xs tracking-[0.25em] text-primary border border-primary px-10 py-3 hover:bg-primary hover:text-primary-foreground transition-all uppercase"
            >
              {showAll ? 'Show Less' : `View All ${withProducts.length} Categories`}
            </button>
          </div>
        )}
      </div>

      {/* Bottom ornate line */}
      <div className="absolute bottom-0 left-0 right-0 ornate-line" />
    </section>
  );
}
