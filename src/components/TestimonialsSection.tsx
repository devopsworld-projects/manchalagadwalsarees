import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Star } from 'lucide-react';
import { SectionHeader } from './SectionHeader';

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

  return (
    <section className="py-28 md:py-40 bg-foreground relative overflow-hidden">
      {/* subtle radial */}
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: 'radial-gradient(circle at 50% 30%, hsl(var(--accent)) 0%, transparent 60%)',
      }} />

      <div className="container relative">
        <div className="text-center mb-16 md:mb-20 max-w-3xl mx-auto">
          <div className="flex items-baseline justify-center gap-5 mb-6">
            <span className="font-display text-[42px] md:text-[64px] leading-none font-light text-accent/40">
              IV.
            </span>
            <div className="flex items-center gap-3">
              <div className="w-10 h-px bg-accent" />
              <span className="font-body text-[10px] tracking-luxe uppercase text-accent">
                Voices of Our Patrons
              </span>
            </div>
          </div>
          <h2 className="font-display text-[40px] sm:text-[56px] md:text-[72px] leading-[0.95] font-medium tracking-[-0.01em] text-background">
            Words from those
            <br />
            <span className="italic font-serif font-normal text-accent">who wear us.</span>
          </h2>
        </div>

        {/* Editorial grid of pull-quotes */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-background/10">
          {testimonials.slice(0, 6).map((t: any, i: number) => (
            <div
              key={t.id}
              className="bg-foreground p-8 md:p-10 lg:p-12 flex flex-col"
            >
              <span className="font-display text-5xl text-accent leading-none mb-4">"</span>
              <p className="font-serif text-lg md:text-xl text-background/85 leading-snug italic mb-8 flex-1">
                {t.content}
              </p>
              <div className="flex items-center justify-between pt-6 border-t border-background/10">
                <div className="flex items-center gap-3">
                  {t.image_url && (
                    <img src={t.image_url} alt={t.name} className="h-10 w-10 rounded-full object-cover border border-accent/30" />
                  )}
                  <div>
                    <p className="font-display text-[11px] font-medium tracking-luxe uppercase text-background">
                      {t.name}
                    </p>
                    <p className="font-body text-[9px] tracking-refined text-background/40 mt-1">
                      Verified Patron · {String(i + 1).padStart(2, '0')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className={`h-3 w-3 ${j < t.rating ? 'fill-accent text-accent' : 'text-background/15'}`} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
