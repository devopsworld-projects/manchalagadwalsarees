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
    <section className="py-8 md:py-12">
      <div className="container">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {banners.map((b: any) => (
            <Link key={b.id} to={b.link || '/collections'} className="group relative overflow-hidden rounded-lg aspect-[16/9]">
              <img src={b.image_url} alt={b.title || 'Banner'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              {(b.title || b.subtitle) && (
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent flex flex-col justify-end p-4">
                  {b.title && <h3 className="font-display text-lg font-bold text-primary-foreground">{b.title}</h3>}
                  {b.subtitle && <p className="font-body text-sm text-primary-foreground/80">{b.subtitle}</p>}
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
