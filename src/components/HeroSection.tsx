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
    <section className="relative min-h-[85vh] md:min-h-screen flex items-stretch overflow-hidden">
      {/* Split layout: left content, right image */}
      <div className="relative z-10 flex flex-col md:flex-row w-full">
        {/* Left — Dark content panel */}
        <div className="relative flex-1 flex items-center justify-center md:justify-end bg-foreground px-6 sm:px-10 md:px-16 py-16 md:py-0 order-2 md:order-1">
          {/* Decorative temple pattern on left edge */}
          <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-accent/40 to-transparent hidden md:block" />

          {/* Corner ornaments */}
          <div className="absolute top-8 left-8 w-16 h-16 hidden lg:block">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-accent/50 to-transparent" />
            <div className="absolute top-0 left-0 h-full w-[1px] bg-gradient-to-b from-accent/50 to-transparent" />
            <div className="absolute top-2 left-2 w-2 h-2 border border-accent/40 rotate-45" />
          </div>

          <div className="max-w-md md:mr-12 lg:mr-20">
            {/* Subtitle flourish */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="text-accent text-[7px]">◆</span>
              <div className="w-12 h-[1px] bg-accent/40" />
              <p className="font-body text-[10px] tracking-[0.4em] uppercase text-accent/80 font-light">
                {subtitle}
              </p>
            </motion.div>

            {/* Title — stacked dramatically */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <h1 className="font-display text-4xl sm:text-5xl md:text-5xl lg:text-7xl font-bold leading-[0.95] text-background tracking-wide">
                {title.split(' ').map((word, i) => (
                  <span key={i} className="block">
                    {i === 0 ? word : <span className="gold-shimmer">{word}</span>}
                  </span>
                ))}
              </h1>
            </motion.div>

            {/* Ornate separator */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="ornate-line w-32 my-6 origin-left"
            />

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="font-serif text-sm md:text-base text-background/50 mb-8 leading-relaxed italic max-w-sm"
            >
              {settings?.footer_description || 'Handcrafted sarees that blend centuries of artistry with contemporary grace. Every thread tells a story.'}
            </motion.p>

            {/* CTAs — stacked on mobile, inline on desktop */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.3 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link
                to={ctaLink}
                className="group relative bg-accent text-accent-foreground px-10 py-4 text-[11px] tracking-[0.3em] font-display font-semibold transition-all hover:shadow-[0_0_40px_hsl(var(--gold)/0.3)] uppercase text-center"
              >
                {ctaText}
              </Link>
              <Link
                to="/about"
                className="border border-background/20 text-background/70 px-10 py-4 text-[11px] tracking-[0.3em] font-display hover:border-accent/50 hover:text-accent transition-all uppercase text-center"
              >
                Our Heritage
              </Link>
            </motion.div>

            {/* Trust badges — horizontal strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.6 }}
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
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: 0.2 }}
          className="relative flex-1 min-h-[50vh] md:min-h-0 order-1 md:order-2"
        >
          <img
            src={bgImage}
            alt={title}
            className="w-full h-full object-cover"
            width={1920}
            height={1080}
          />
          {/* Subtle gradient overlay on image edge */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-foreground to-transparent hidden md:block" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-foreground to-transparent md:hidden" />

          {/* Floating badge on image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="absolute bottom-8 right-8 bg-foreground/80 backdrop-blur-md border border-accent/30 px-5 py-3 hidden lg:block"
          >
            <p className="font-display text-xs tracking-[0.2em] text-accent uppercase">Since 1998</p>
            <p className="font-body text-[10px] text-background/50 mt-0.5">25+ Years of Legacy</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom ornate border */}
      <div className="absolute bottom-0 left-0 right-0 z-20 ornate-line" />
    </section>
  );
}
