import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function CategoriesSection() {
  const { data: categories = [] } = useQuery({
    queryKey: ['storefront-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true })
        .limit(6);
      if (error) throw error;
      return data;
    },
  });

  if (categories.length === 0) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Shop by Category
          </h2>
          <p className="font-body text-muted-foreground mt-2">
            Find the perfect saree for every occasion
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/collections?filter=${cat.slug}`}
              className="group relative aspect-[4/5] overflow-hidden rounded-sm"
            >
              <img
                src={cat.image_url || '/placeholder.svg'}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                width={800}
                height={1024}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
                  {cat.name}
                </h3>
                <span className="inline-block text-xs tracking-[0.15em] text-primary-foreground/80 font-body border-b border-primary-foreground/40 pb-0.5 group-hover:border-gold transition-colors">
                  EXPLORE →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
