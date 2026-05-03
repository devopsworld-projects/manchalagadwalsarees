import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { SectionHeader } from './SectionHeader';

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

  if (categories.length === 0) return null;
  const displayed = showAll ? categories : categories.slice(0, 8);

  return (
    <section className="py-28 md:py-40 bg-secondary/40 relative">
      <div className="container">
        <SectionHeader
          index="I"
          eyebrow="The Atelier"
          title={
            <>
              Our Sacred
              <br />
              <span className="italic font-serif font-normal text-accent">Collections</span>
            </>
          }
          subtitle={`A library of ${categories.length} handwoven traditions — each carrying the breath of its loom.`}
          link={{ to: '/collections', label: 'Browse all categories' }}
        />

        {/* Editorial asymmetric grid — first card spans 2 rows on lg */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {displayed.map((cat, i) => {
            const isFeature = i === 0;
            return (
              <Link
                key={cat.id}
                to={`/collections?filter=${cat.slug}`}
                className={`group relative overflow-hidden bg-foreground ${
                  isFeature ? 'lg:col-span-2 lg:row-span-2 aspect-[4/5] lg:aspect-auto' : 'aspect-[3/4]'
                }`}
              >
                <CategoryImage cat={cat} />
                {/* Editorial gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/95 via-foreground/30 to-transparent" />
                {/* Inner thin frame on hover */}
                <div className="absolute inset-3 border border-background/0 group-hover:border-background/30 transition-colors duration-700" />

                <div className={`absolute inset-x-0 bottom-0 p-6 md:p-8 ${isFeature ? 'lg:p-12' : ''}`}>
                  <span className="font-body text-[9px] tracking-luxe uppercase text-accent/90 block mb-3">
                    {String(i + 1).padStart(2, '0')} · {cat.product_count} pieces
                  </span>
                  <h3
                    className={`font-display text-background tracking-[-0.005em] leading-[0.95] ${
                      isFeature
                        ? 'text-3xl md:text-4xl lg:text-6xl font-medium'
                        : 'text-xl md:text-2xl font-medium'
                    }`}
                  >
                    {cat.name}
                  </h3>
                  <span className="inline-block mt-5 font-body text-[10px] tracking-luxe uppercase text-background/80 border-b border-accent pb-1 group-hover:text-accent transition-colors">
                    Explore →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {categories.length > 8 && (
          <div className="text-center mt-16">
            <button
              onClick={() => setShowAll(!showAll)}
              className="btn-luxe font-display text-[10px] tracking-luxe text-foreground border border-foreground/40 px-14 py-[18px] hover:bg-foreground hover:text-background transition-all uppercase"
            >
              {showAll ? 'Show Less' : `View All ${categories.length} Traditions`}
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
        className="w-full h-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
        loading="lazy"
        width={800}
        height={1000}
      />
    );
  }
  return <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />;
}
