import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Star } from 'lucide-react';

export function TestimonialsSection() {
  const { data: testimonials = [] } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase.from('testimonials').select('*').eq('is_active', true).order('sort_order');
      if (error) throw error;
      return data;
    },
  });

  if (testimonials.length === 0) return null;

  // Take first 3 for featured layout
  const featured = testimonials[0];
  const rest = testimonials.slice(1, 3);

  return (
    <section className="py-20 md:py-28 relative">
      <div className="container">
        {/* Left-aligned editorial header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-[2px] bg-accent" />
              <span className="font-body text-[10px] tracking-[0.4em] uppercase text-accent">Testimonials</span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground tracking-wide">
              Voices of Our Patrons
            </h2>
          </div>
        </div>

        {/* Asymmetric testimonials layout */}
        <div className="grid md:grid-cols-5 gap-4 md:gap-6">
          {/* Featured testimonial — large */}
          {featured && (
            <div className="md:col-span-3 bg-foreground text-background p-8 md:p-12 relative">
              {/* Corner ornaments */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-accent/40" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-accent/40" />

              <div className="flex gap-0.5 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < (featured as any).rating ? 'fill-accent text-accent' : 'text-background/20'}`} />
                ))}
              </div>
              <p className="font-serif text-lg md:text-xl text-background/70 leading-relaxed italic mb-8">
                "{(featured as any).content}"
              </p>
              <div className="flex items-center gap-4">
                {(featured as any).image_url && (
                  <img src={(featured as any).image_url} alt={(featured as any).name} className="h-12 w-12 rounded-full object-cover border-2 border-accent/30" />
                )}
                <div>
                  <p className="font-display text-sm font-bold tracking-[0.15em] uppercase text-background">{(featured as any).name}</p>
                  <div className="w-6 h-[1px] bg-accent/40 mt-1" />
                </div>
              </div>
            </div>
          )}

          {/* Smaller testimonials stacked */}
          <div className="md:col-span-2 flex flex-col gap-4 md:gap-6">
            {rest.map((t: any) => (
              <div key={t.id} className="flex-1 bg-card border border-border p-6 md:p-8 relative">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent/50 via-accent to-accent/50" />
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-3 w-3 ${i < t.rating ? 'fill-accent text-accent' : 'text-muted'}`} />
                  ))}
                </div>
                <p className="font-serif text-sm text-foreground/70 leading-relaxed italic mb-4">
                  "{t.content}"
                </p>
                <div className="flex items-center gap-3">
                  {t.image_url && (
                    <img src={t.image_url} alt={t.name} className="h-9 w-9 rounded-full object-cover border border-accent/20" />
                  )}
                  <p className="font-display text-[11px] font-bold tracking-[0.15em] uppercase">{t.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Show remaining testimonials in a row if more than 3 */}
        {testimonials.length > 3 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {testimonials.slice(3).map((t: any) => (
              <div key={t.id} className="bg-card border border-border p-6 relative">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-3 w-3 ${i < t.rating ? 'fill-accent text-accent' : 'text-muted'}`} />
                  ))}
                </div>
                <p className="font-serif text-sm text-foreground/70 leading-relaxed italic mb-4">"{t.content}"</p>
                <div className="flex items-center gap-3">
                  {t.image_url && <img src={t.image_url} alt={t.name} className="h-8 w-8 rounded-full object-cover border border-accent/20" />}
                  <p className="font-display text-[10px] font-bold tracking-[0.15em] uppercase">{t.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
