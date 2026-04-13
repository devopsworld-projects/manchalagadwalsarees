import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

export function BannerSlider() {
  const { data: banners = [] } = useQuery({
    queryKey: ['banners'],
    queryFn: async () => {
      const { data, error } = await supabase.from('banners').select('*').eq('is_active', true).order('sort_order');
      if (error) throw error;
      return data;
    },
  });

  if (banners.length === 0) return null;

  return (
    <section className="py-10 md:py-16">
      <div className="container">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {banners.map((b: any) => (
            <Link key={b.id} to={b.link || '/collections'} className="group relative overflow-hidden aspect-[16/9]">
              <img src={b.image_url} alt={b.title || 'Banner'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              {(b.title || b.subtitle) && (
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent flex flex-col justify-end p-5">
                  {b.title && <h3 className="font-display text-base font-bold text-background tracking-wider">{b.title}</h3>}
                  {b.subtitle && <p className="font-body text-xs text-background/70 mt-1">{b.subtitle}</p>}
                </div>
              )}
              {/* Hover gold border */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-accent/30 transition-colors duration-300" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
