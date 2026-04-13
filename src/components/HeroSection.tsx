import { Link } from 'react-router-dom';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import { motion } from 'framer-motion';
import heroImage from '@/assets/hero-woman.jpg';

export function HeroSection() {
  const { data: settings } = useStoreSettings();

  const title = settings?.hero_title || "Kavi Women's World";
  const subtitle = settings?.hero_subtitle || 'Elegance in Every Drape';
  const ctaText = settings?.hero_cta_text || 'Explore Collections';
  const ctaLink = settings?.hero_cta_link || '/collections';
  const bgImage = settings?.hero_image || heroImage;

  return (
    <section className="relative min-h-[70vh] sm:min-h-[80vh] md:min-h-[90vh] flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt={title}
          className="w-full h-full object-cover scale-105"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-foreground/20" />
      </div>

      {/* Temple corner ornaments */}
      <div className="absolute top-8 left-8 w-24 h-24 hidden md:block">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-accent to-transparent" />
        <div className="absolute top-0 left-0 h-full w-[2px] bg-gradient-to-b from-accent to-transparent" />
        <div className="absolute top-2 left-2 w-3 h-3 border border-accent/60 rotate-45" />
      </div>
      <div className="absolute bottom-8 right-8 w-24 h-24 hidden md:block">
        <div className="absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-l from-accent to-transparent" />
        <div className="absolute bottom-0 right-0 h-full w-[2px] bg-gradient-to-t from-accent to-transparent" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border border-accent/60 rotate-45" />
      </div>

      <div className="relative container z-10">
        <div className="max-w-xl">
          {/* Subtitle with temple diamond */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="text-accent text-[8px]">◆</span>
            <div className="w-10 h-[1px] bg-accent/60" />
            <p className="font-body text-[11px] tracking-[0.35em] uppercase text-accent font-light">
              {subtitle}
            </p>
            <div className="w-10 h-[1px] bg-accent/60" />
            <span className="text-accent text-[8px]">◆</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] text-primary-foreground"
          >
            {title.split(' ').slice(0, 1).join(' ')}
            <br />
            <span className="gold-shimmer">{title.split(' ').slice(1).join(' ')}</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="font-serif text-base md:text-lg text-primary-foreground/75 mb-10 max-w-md leading-relaxed italic"
          >
            {settings?.footer_description || 'Discover the finest collection of handcrafted sarees that blend traditional artistry with contemporary grace.'}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              to={ctaLink}
              className="group relative bg-accent text-accent-foreground px-8 sm:px-10 py-3.5 text-xs sm:text-sm tracking-[0.2em] font-display font-semibold transition-all hover:shadow-[0_0_30px_hsl(var(--gold)/0.3)] hover:bg-accent/90 uppercase"
            >
              <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent-foreground/30" />
              <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent-foreground/30" />
              {ctaText}
            </Link>
            <Link
              to="/about"
              className="border border-accent/40 text-primary-foreground px-8 sm:px-10 py-3.5 text-xs sm:text-sm tracking-[0.2em] font-display hover:bg-accent/10 hover:border-accent/70 transition-all uppercase"
            >
              Our Heritage
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex flex-wrap gap-6 mt-10 text-primary-foreground/45"
          >
            {[
              { icon: '🏛️', text: 'Handcrafted' },
              { icon: '🚚', text: 'Free Shipping' },
              { icon: '✓', text: '100% Authentic' },
            ].map(badge => (
              <span key={badge.text} className="flex items-center gap-2 text-xs font-body tracking-wider">
                <span className="text-sm">{badge.icon}</span> {badge.text}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom ornate gold border */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="ornate-line" />
        <div className="h-[1px] bg-gradient-to-r from-transparent via-accent/20 to-transparent mt-[2px]" />
      </div>
    </section>
  );
}
