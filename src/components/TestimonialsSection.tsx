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

  return (
    <section className="py-20 md:py-28 bg-primary/[0.03] relative">
      <div className="absolute top-0 left-0 right-0 ornate-line" />

      <div className="container">
        <div className="text-center mb-14">
          <span className="text-accent text-[8px]">◆ ◆ ◆</span>
          <h2 className="font-display text-2xl md:text-4xl font-bold text-foreground mt-3 tracking-wide">
            Voices of Our Patrons
          </h2>
          <div className="w-20 ornate-line mx-auto mt-4" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t: any) => (
            <div key={t.id} className="bg-background border border-border p-8 relative group hover:shadow-xl transition-shadow duration-300">
              {/* Temple corner accents */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-accent/40" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-accent/40" />

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-3.5 w-3.5 ${i < t.rating ? 'fill-accent text-accent' : 'text-muted'}`} />
                ))}
              </div>

              {/* Quote */}
              <p className="font-serif text-base text-foreground/80 mb-6 leading-relaxed italic">
                "{t.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                {t.image_url && (
                  <img src={t.image_url} alt={t.name} className="h-10 w-10 rounded-full object-cover border border-accent/30" />
                )}
                <div>
                  <p className="font-display text-xs font-bold tracking-wider uppercase">{t.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 ornate-line" />
    </section>
  );
}
