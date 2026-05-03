import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import heroSlide2 from '@/assets/hero-slide-2.jpg';
import heroSlide3 from '@/assets/hero-slide-3.jpg';
import manchalaHero from '@/assets/manchala-hero.jpg';

export function HeroSection() {
  const { data: settings } = useStoreSettings();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const { data: slides = [] } = useQuery({
    queryKey: ['hero-slides'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      if (error) throw error;
      return data;
    },
  });

  const fallbackSlides = [
    { id: 'f1', title: 'Manchala Gadwal Sarees', subtitle: 'Handwoven Heritage from the Looms of Telangana', image_url: manchalaHero, cta_text: 'Shop Collection', cta_link: '/collections' },
    { id: 'f2', title: 'Bridal & Festive Silks', subtitle: 'Pure Zari, Temple Borders, Timeless Grace', image_url: heroSlide2, cta_text: 'Explore Bridal', cta_link: '/collections?filter=bridal' },
    { id: 'f3', title: 'New Arrivals', subtitle: 'Fresh Weaves in Royal Maroon & Gold', image_url: heroSlide3, cta_text: 'Discover', cta_link: '/collections?filter=new-arrivals' },
  ];

  const activeSlides = slides.length > 0 ? slides : fallbackSlides;
  const total = activeSlides.length;

  const goTo = useCallback((idx: number, dir: number) => {
    setDirection(dir);
    setCurrent(idx);
  }, []);

  const next = useCallback(() => goTo((current + 1) % total, 1), [current, total, goTo]);
  const prev = useCallback(() => goTo((current - 1 + total) % total, -1), [current, total, goTo]);

  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, total]);

  const slide = activeSlides[current];

  return (
    <section className="relative h-[100svh] min-h-[640px] overflow-hidden bg-foreground">
      {/* Background image — slow Ken Burns */}
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={slide.id || current}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img
            src={slide.image_url}
            alt={slide.title || 'Hero'}
            className="w-full h-full object-cover"
            width={1920}
            height={1080}
          />
          {/* Layered editorial gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-foreground/20" />
        </motion.div>
      </AnimatePresence>

      {/* Subtle thin frame */}
      <div className="pointer-events-none absolute inset-6 md:inset-10 border border-background/10 z-10" />

      {/* Content — editorial alignment */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-24 md:pb-32 lg:pb-36">
        <div className="container">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id || current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-2xl"
            >
              {/* Eyebrow */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-px bg-accent" />
                <p className="font-body text-[10px] md:text-[11px] tracking-luxe uppercase text-accent font-normal">
                  {slide.subtitle || 'Elegance in Every Drape'}
                </p>
              </div>

              {/* Title — refined serif scale */}
              <h1 className="font-display text-4xl sm:text-5xl md:text-[64px] lg:text-[78px] font-medium leading-[1] text-background tracking-[0.01em] mb-8">
                {(slide.title || "Manchala Gadwal Sarees").split(' ').map((word: string, i: number, arr: string[]) => (
                  <span key={i} className="block">
                    {i === arr.length - 1 ? <span className="italic font-serif text-accent font-normal">{word}</span> : word}
                  </span>
                ))}
              </h1>

              {/* Hairline */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="h-px w-20 bg-accent/70 mb-10 origin-left"
              />

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to={slide.cta_link || '/collections'}
                  className="btn-luxe group bg-accent text-accent-foreground px-12 md:px-14 py-4 md:py-[18px] text-[10px] md:text-[11px] tracking-luxe font-display font-semibold uppercase text-center hover:bg-accent/90"
                >
                  {slide.cta_text || 'Explore Collections'}
                </Link>
                <Link
                  to="/about"
                  className="border border-background/30 text-background px-12 md:px-14 py-4 md:py-[18px] text-[10px] md:text-[11px] tracking-luxe font-display uppercase text-center hover:border-accent hover:text-accent transition-all duration-500"
                >
                  Our Heritage
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation arrows */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full border border-background/25 text-background/70 hover:bg-accent hover:border-accent hover:text-accent-foreground transition-all duration-500 flex items-center justify-center backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full border border-background/25 text-background/70 hover:bg-accent hover:border-accent hover:text-accent-foreground transition-all duration-500 flex items-center justify-center backdrop-blur-sm"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Indicators */}
          <div className="absolute right-6 md:right-14 bottom-24 md:bottom-32 z-20 flex flex-col gap-2">
            {activeSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > current ? 1 : -1)}
                className={`w-px transition-all duration-700 ease-out ${
                  i === current ? 'h-10 bg-accent' : 'h-5 bg-background/30 hover:bg-background/60'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="absolute left-6 md:left-14 bottom-24 md:bottom-32 z-20 font-display flex items-baseline">
            <span className="text-2xl font-medium text-accent tracking-wide">{String(current + 1).padStart(2, '0')}</span>
            <span className="text-xs text-background/40 mx-2">—</span>
            <span className="text-xs text-background/50">{String(total).padStart(2, '0')}</span>
          </div>
        </>
      )}
    </section>
  );
}
