import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';

const categoryColors: Record<string, string> = {
  'kanjivaram-sarees': 'from-rose-900/80 to-rose-700/40',
  'banarasi-sarees': 'from-purple-900/80 to-purple-700/40',
  'soft-silk-sarees': 'from-pink-900/80 to-pink-700/40',
  'mysore-silk-sarees': 'from-emerald-900/80 to-emerald-700/40',
  'jaipur-cotton-sarees': 'from-amber-900/80 to-amber-700/40',
  'linen-sarees': 'from-stone-900/80 to-stone-700/40',
  'georgette-sarees': 'from-fuchsia-900/80 to-fuchsia-700/40',
  'sambalpuri-sarees': 'from-red-900/80 to-red-700/40',
  'ikkat-sarees': 'from-indigo-900/80 to-indigo-700/40',
  'chanderi-cotton-silk': 'from-cyan-900/80 to-cyan-700/40',
  'kalamkari-sarees': 'from-orange-900/80 to-orange-700/40',
  'chiffon-sarees': 'from-violet-900/80 to-violet-700/40',
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

      // Get product counts per category
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
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Shop by Category
          </h2>
          <p className="font-body text-muted-foreground mt-2">
            {categories.length} curated collections — find your perfect saree
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayed.map((cat) => {
            const gradient = categoryColors[cat.slug] || 'from-foreground/70 to-foreground/30';
            return (
              <Link
                key={cat.id}
                to={`/collections?filter=${cat.slug}`}
                className="group relative aspect-[3/4] overflow-hidden rounded-lg"
              >
                {cat.image_url ? (
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${gradient}`} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-display text-base md:text-lg font-bold text-white leading-tight mb-1">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] font-body text-white/70 tracking-wide">
                    {cat.product_count} {cat.product_count === 1 ? 'product' : 'products'}
                  </span>
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-body text-white bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                    Explore →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {categories.length > 8 && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAll(!showAll)}
              className="font-body text-sm tracking-[0.15em] text-primary border border-primary px-8 py-3 hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {showAll ? 'SHOW LESS' : `VIEW ALL ${categories.length} CATEGORIES`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
