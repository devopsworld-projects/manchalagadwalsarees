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

  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-8">What Our Customers Say</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t: any) => (
            <div key={t.id} className="bg-background border border-border rounded-lg p-6 relative">
              <Quote className="h-6 w-6 text-primary/20 absolute top-4 right-4" />
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-muted'}`} />
                ))}
              </div>
              <p className="font-body text-sm text-muted-foreground mb-4 leading-relaxed">"{t.content}"</p>
              <div className="flex items-center gap-3">
                {t.image_url && <img src={t.image_url} alt={t.name} className="h-10 w-10 rounded-full object-cover" />}
                <p className="font-body text-sm font-semibold">{t.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
