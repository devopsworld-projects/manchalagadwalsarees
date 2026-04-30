import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Star, Quote } from 'lucide-react';

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

  const featured = testimonials[0];
  const rest = testimonials.slice(1, 4);

  return (
    <section className="py-24 md:py-32 relative buti-pattern">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="lotus-divider mb-5">
            <span className="lotus" />
          </div>
          <p className="devanagari text-accent text-base md:text-lg mb-2">ग्राहकाणां वचनानि</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-2 tracking-wide">
            Voices of Our Patrons
          </h2>
          <div className="w-20 ornate-line mx-auto mt-5" />
        </div>

        {/* Featured + stacked layout */}
        <div className="grid md:grid-cols-5 gap-5 md:gap-6">
          {/* Featured — large */}
          {featured && (
            <div className="md:col-span-3 bg-foreground text-background p-8 md:p-12 lg:p-14 relative">
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-accent/30" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-accent/30" />
              
              <Quote className="h-8 w-8 text-accent/20 mb-6" />

              <div className="flex gap-0.5 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < (featured as any).rating ? 'fill-accent text-accent' : 'text-background/15'}`} />
                ))}
              </div>
              <p className="font-serif text-lg md:text-xl lg:text-2xl text-background/70 leading-relaxed italic mb-10">
                "{(featured as any).content}"
              </p>
              <div className="flex items-center gap-4">
                {(featured as any).image_url && (
                  <img src={(featured as any).image_url} alt={(featured as any).name} className="h-12 w-12 rounded-full object-cover border-2 border-accent/30" />
                )}
                <div>
                  <p className="font-display text-sm font-bold tracking-[0.15em] uppercase text-background">{(featured as any).name}</p>
                  <div className="w-8 h-[1px] bg-accent/40 mt-2" />
                </div>
              </div>
            </div>
          )}

          {/* Smaller testimonials */}
          <div className="md:col-span-2 flex flex-col gap-5">
            {rest.map((t: any) => (
              <div key={t.id} className="flex-1 bg-card border border-border p-6 md:p-8 relative">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent/40 via-accent to-accent/40" />
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-3 w-3 ${i < t.rating ? 'fill-accent text-accent' : 'text-muted'}`} />
                  ))}
                </div>
                <p className="font-serif text-sm text-foreground/70 leading-relaxed italic mb-5">
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

        {/* Extra testimonials row */}
        {testimonials.length > 4 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
            {testimonials.slice(4).map((t: any) => (
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
