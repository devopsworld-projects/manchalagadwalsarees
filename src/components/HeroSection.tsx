import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import heroSlide1 from '@/assets/hero-slide-1.jpg';
import heroSlide2 from '@/assets/hero-slide-2.jpg';
import heroSlide3 from '@/assets/hero-slide-3.jpg';

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
    { id: 'f1', title: 'Timeless Kanjivaram', subtitle: 'Pure Silk, Pure Elegance', image_url: heroSlide1, cta_text: 'Shop Now', cta_link: '/collections' },
    { id: 'f2', title: 'Royal Banarasi Collection', subtitle: 'Heritage Woven in Gold', image_url: heroSlide2, cta_text: 'Explore', cta_link: '/collections' },
    { id: 'f3', title: 'New Arrivals', subtitle: 'Pastel Dreams in Silk', image_url: heroSlide3, cta_text: 'Discover', cta_link: '/collections' },
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
    <section className="relative h-[100svh] min-h-[600px] overflow-hidden bg-foreground">
      {/* ─── Background Image with Ken Burns ─── */}
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={slide.id || current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <img
            src={slide.image_url}
            alt={slide.title || 'Hero'}
            className="w-full h-full object-cover"
            width={1920}
            height={1080}
          />
          {/* Cinematic overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/50 to-foreground/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-foreground/30" />
        </motion.div>
      </AnimatePresence>

      {/* ─── Decorative Frame ─── */}
      <div className="absolute inset-6 md:inset-10 pointer-events-none z-10">
        {/* Corner ornaments */}
        <div className="absolute top-0 left-0 w-12 h-12 md:w-20 md:h-20">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-accent/60 to-transparent" />
          <div className="absolute top-0 left-0 h-full w-[1px] bg-gradient-to-b from-accent/60 to-transparent" />
          <div className="absolute top-2 left-2 md:top-3 md:left-3 w-2 h-2 border border-accent/40 rotate-45" />
        </div>
        <div className="absolute top-0 right-0 w-12 h-12 md:w-20 md:h-20">
          <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-l from-accent/60 to-transparent" />
          <div className="absolute top-0 right-0 h-full w-[1px] bg-gradient-to-b from-accent/60 to-transparent" />
          <div className="absolute top-2 right-2 md:top-3 md:right-3 w-2 h-2 border border-accent/40 rotate-45" />
        </div>
        <div className="absolute bottom-0 left-0 w-12 h-12 md:w-20 md:h-20">
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-accent/60 to-transparent" />
          <div className="absolute bottom-0 left-0 h-full w-[1px] bg-gradient-to-t from-accent/60 to-transparent" />
        </div>
        <div className="absolute bottom-0 right-0 w-12 h-12 md:w-20 md:h-20">
          <div className="absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-l from-accent/60 to-transparent" />
          <div className="absolute bottom-0 right-0 h-full w-[1px] bg-gradient-to-t from-accent/60 to-transparent" />
        </div>
      </div>

      {/* ─── Content ─── */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-20 md:pb-28 lg:pb-32">
        <div className="container">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id || current}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-2xl"
            >
              {/* Subtitle tag */}
              <div className="flex items-center gap-3 mb-5">
                <span className="text-accent text-[7px]">◆</span>
                <div className="w-10 h-[1px] bg-accent/50" />
                <p className="font-body text-[10px] md:text-[11px] tracking-[0.4em] uppercase text-accent/90 font-light">
                  {slide.subtitle || 'Elegance in Every Drape'}
                </p>
              </div>

              {/* Title */}
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.9] text-background tracking-wide mb-6">
                {(slide.title || "Manchala Gadwal Sarees").split(' ').map((word: string, i: number, arr: string[]) => (
                  <span key={i} className="block">
                    {i === arr.length - 1 ? <span className="gold-shimmer">{word}</span> : word}
                  </span>
                ))}
              </h1>

              {/* Ornate line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="ornate-line w-24 md:w-32 mb-8 origin-left"
              />

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to={slide.cta_link || '/collections'}
                  className="group relative bg-accent text-accent-foreground px-10 md:px-14 py-4 md:py-5 text-[10px] md:text-[11px] tracking-[0.3em] font-display font-semibold transition-all hover:shadow-[0_0_50px_hsl(var(--gold)/0.4)] uppercase text-center"
                >
                  {slide.cta_text || 'Explore Collections'}
                </Link>
                <Link
                  to="/about"
                  className="border border-background/25 text-background/80 px-10 md:px-14 py-4 md:py-5 text-[10px] md:text-[11px] tracking-[0.3em] font-display hover:border-accent/60 hover:text-accent transition-all uppercase text-center backdrop-blur-sm"
                >
                  Our Heritage
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* ─── Bottom Stats Bar ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="hidden md:flex items-center gap-12 mt-14"
          >
            {[
              { num: '500+', label: 'Artisans' },
              { num: '100%', label: 'Handcrafted' },
              { num: 'Free', label: 'Pan-India Shipping' },
            ].map((item, i) => (
              <div key={item.label} className="flex items-center gap-4">
                {i > 0 && <div className="w-px h-8 bg-background/15" />}
                {i > 0 && <div className="ml-4" />}
                <div>
                  <p className="font-display text-lg font-bold text-accent">{item.num}</p>
                  <p className="font-body text-[9px] tracking-[0.2em] text-background/35 uppercase">{item.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ─── Navigation Arrows ─── */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 z-20 w-12 h-12 border border-background/20 text-background/60 hover:bg-accent hover:border-accent hover:text-accent-foreground transition-all flex items-center justify-center backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 z-20 w-12 h-12 border border-background/20 text-background/60 hover:bg-accent hover:border-accent hover:text-accent-foreground transition-all flex items-center justify-center backdrop-blur-sm"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Slide indicators — vertical on right */}
          <div className="absolute right-4 md:right-10 bottom-20 md:bottom-28 z-20 flex flex-col gap-2">
            {activeSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > current ? 1 : -1)}
                className={`w-[3px] transition-all duration-500 ${
                  i === current ? 'h-8 bg-accent' : 'h-4 bg-background/25 hover:bg-background/40'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Slide counter */}
          <div className="absolute left-4 md:left-10 bottom-20 md:bottom-28 z-20">
            <span className="font-display text-3xl font-bold text-accent">{String(current + 1).padStart(2, '0')}</span>
            <span className="font-body text-sm text-background/30 mx-2">/</span>
            <span className="font-body text-sm text-background/30">{String(total).padStart(2, '0')}</span>
          </div>
        </>
      )}

      {/* Bottom ornate line */}
      <div className="absolute bottom-0 left-0 right-0 z-20 ornate-line" />
    </section>
  );
}
