import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import { Star, ExternalLink } from 'lucide-react';

function GoogleGIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
      <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
      <path fill="#FBBC05" d="M11.69 28.18A13.94 13.94 0 0110.96 24c0-1.45.25-2.86.69-4.18v-5.7H4.34A22 22 0 002 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"/>
      <path fill="#EA4335" d="M24 9.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 2.97 29.93 1 24 1 15.4 1 7.96 5.93 4.34 13.12l7.35 5.7C13.42 13.62 18.27 9.75 24 9.75z"/>
    </svg>
  );
}

interface ReviewRow {
  id: string;
  author_name: string;
  author_initial: string | null;
  rating: number;
  review_text: string;
  review_date: string | null;
  profile_photo_url: string | null;
}

export function GoogleReviewsSection() {
  const { data: reviews = [] } = useQuery({
    queryKey: ['google-reviews-public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('google_reviews')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      if (error) throw error;
      return (data || []) as ReviewRow[];
    },
  });
  const { data: settings } = useStoreSettings();
  const reviewsUrl = settings?.google_reviews_url || 'https://www.google.com/search?q=manchala+gadwal+sarees';

  if (reviews.length === 0) return null;

  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  const fmtDate = (d: string | null) => {
    if (!d) return '';
    try {
      return new Date(d).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
    } catch { return ''; }
  };

  return (
    <section className="py-12 md:py-28 bg-background">
      <div className="container px-4">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8 md:mb-12">
          <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
            <GoogleGIcon className="h-6 w-6 md:h-8 md:w-8" />
            <span className="font-display text-[10px] md:text-xs font-bold tracking-[0.25em] uppercase text-muted-foreground">Google Reviews</span>
          </div>
          <h2 className="font-display text-2xl md:text-5xl font-bold text-foreground tracking-wide">
            What Our Customers Say
          </h2>
          <div className="w-20 ornate-line mt-5 mb-5" />
          <div className="flex items-center gap-3">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-5 w-5 ${i < Math.round(avg) ? 'fill-amber-400 text-amber-400' : 'text-muted'}`} />
              ))}
            </div>
            <p className="font-body text-sm text-foreground">
              <span className="font-bold">{avg.toFixed(1)}</span>
              <span className="text-muted-foreground"> · Based on {reviews.length} review{reviews.length === 1 ? '' : 's'}</span>
            </p>
          </div>
        </div>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {reviews.map((r) => {
            const initial = (r.author_initial || r.author_name[0] || '?').toUpperCase();
            return (
              <article
                key={r.id}
                className="relative bg-card border border-border p-5 md:p-6 flex flex-col"
              >
                <div className="absolute top-4 right-4">
                  <GoogleGIcon className="h-4 w-4 opacity-70" />
                </div>
                <header className="flex items-center gap-3 mb-3">
                  {r.profile_photo_url ? (
                    <img
                      src={r.profile_photo_url}
                      alt={r.author_name}
                      className="h-11 w-11 rounded-full object-cover border border-border"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-11 w-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-display font-bold text-lg border border-primary/20">
                      {initial}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-display text-sm font-bold text-foreground truncate">{r.author_name}</p>
                    {r.review_date && (
                      <p className="font-body text-[11px] text-muted-foreground">{fmtDate(r.review_date)}</p>
                    )}
                  </div>
                </header>
                <div className="flex gap-0.5 mb-3" aria-label={`Rating: ${r.rating} out of 5`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-muted'}`} />
                  ))}
                </div>
                <p className="font-body text-sm text-foreground/80 leading-relaxed line-clamp-6">
                  {r.review_text}
                </p>
              </article>
            );
          })}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-12">
          <a
            href={reviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 min-h-[44px] px-6 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors font-display text-[11px] font-bold tracking-[0.25em] uppercase"
          >
            <GoogleGIcon className="h-4 w-4" />
            View All Reviews on Google
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
