import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

  // Fallback slide from store settings if no DB slides
  const fallbackSlide = {
    id: 'fallback',
    title: settings?.hero_title || "Kavi Women's World",
    subtitle: settings?.hero_subtitle || 'Elegance in Every Drape',
    image_url: settings?.hero_image || '/placeholder.svg',
    cta_text: settings?.hero_cta_text || 'Explore Collections',
    cta_link: settings?.hero_cta_link || '/collections',
  };

  const activeSlides = slides.length > 0 ? slides : [fallbackSlide];
  const total = activeSlides.length;

  const goTo = useCallback((idx: number, dir: number) => {
    setDirection(dir);
    setCurrent(idx);
  }, []);

  const next = useCallback(() => goTo((current + 1) % total, 1), [current, total, goTo]);
  const prev = useCallback(() => goTo((current - 1 + total) % total, -1), [current, total, goTo]);

  // Auto-advance every 6s
  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, total]);

  const slide = activeSlides[current];

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  return (
    <section className="relative min-h-[85vh] md:min-h-screen flex items-stretch overflow-hidden">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={slide.id || current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex flex-col md:flex-row w-full"
        >
          {/* Left — Dark content panel */}
          <div className="relative flex-1 flex items-center justify-center md:justify-end bg-foreground px-6 sm:px-10 md:px-16 py-16 md:py-0 order-2 md:order-1">
            <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-accent/40 to-transparent hidden md:block" />

            <div className="absolute top-8 left-8 w-16 h-16 hidden lg:block">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-accent/50 to-transparent" />
              <div className="absolute top-0 left-0 h-full w-[1px] bg-gradient-to-b from-accent/50 to-transparent" />
              <div className="absolute top-2 left-2 w-2 h-2 border border-accent/40 rotate-45" />
            </div>

            <div className="max-w-md md:mr-12 lg:mr-20">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex items-center gap-3 mb-6"
              >
                <span className="text-accent text-[7px]">◆</span>
                <div className="w-12 h-[1px] bg-accent/40" />
                <p className="font-body text-[10px] tracking-[0.4em] uppercase text-accent/80 font-light">
                  {slide.subtitle || 'Elegance in Every Drape'}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <h1 className="font-display text-4xl sm:text-5xl md:text-5xl lg:text-7xl font-bold leading-[0.95] text-background tracking-wide">
                  {(slide.title || "Kavi Women's World").split(' ').map((word: string, i: number) => (
                    <span key={i} className="block">
                      {i === 0 ? word : <span className="gold-shimmer">{word}</span>}
                    </span>
                  ))}
                </h1>
              </motion.div>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="ornate-line w-32 my-6 origin-left"
              />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.1 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Link
                  to={slide.cta_link || '/collections'}
                  className="group relative bg-accent text-accent-foreground px-10 py-4 text-[11px] tracking-[0.3em] font-display font-semibold transition-all hover:shadow-[0_0_40px_hsl(var(--gold)/0.3)] uppercase text-center"
                >
                  {slide.cta_text || 'Explore Collections'}
                </Link>
                <Link
                  to="/about"
                  className="border border-background/20 text-background/70 px-10 py-4 text-[11px] tracking-[0.3em] font-display hover:border-accent/50 hover:text-accent transition-all uppercase text-center"
                >
                  Our Heritage
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.4 }}
                className="flex gap-8 mt-10"
              >
                {[
                  { num: '500+', label: 'Artisans' },
                  { num: '100%', label: 'Handcrafted' },
                  { num: 'Free', label: 'Shipping' },
                ].map(item => (
                  <div key={item.label} className="text-center">
                    <p className="font-display text-lg font-bold text-accent">{item.num}</p>
                    <p className="font-body text-[9px] tracking-[0.2em] text-background/30 uppercase">{item.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Right — Full-bleed image */}
          <div className="relative flex-1 min-h-[50vh] md:min-h-0 order-1 md:order-2">
            <img
              src={slide.image_url}
              alt={slide.title || 'Hero'}
              className="w-full h-full object-cover"
              width={1920} height={1080}
            />
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-foreground to-transparent hidden md:block" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-foreground to-transparent md:hidden" />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      {total > 1 && (
        <>
          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-background/10 backdrop-blur-sm border border-background/20 p-3 text-background/70 hover:bg-background/20 hover:text-background transition-all" aria-label="Previous slide">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-background/10 backdrop-blur-sm border border-background/20 p-3 text-background/70 hover:bg-background/20 hover:text-background transition-all" aria-label="Next slide">
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {activeSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > current ? 1 : -1)}
                className={`h-[3px] transition-all duration-500 ${i === current ? 'w-8 bg-accent' : 'w-4 bg-background/30 hover:bg-background/50'}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}

      <div className="absolute bottom-0 left-0 right-0 z-20 ornate-line" />
    </section>
  );
}
