import { Link } from 'react-router-dom';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import heroImage from '@/assets/hero-woman.jpg';

export function HeroSection() {
  const { data: settings } = useStoreSettings();

  const title = settings?.hero_title || 'Kavi Women\'s World';
  const subtitle = settings?.hero_subtitle || 'Elegance in Every Drape';
  const ctaText = settings?.hero_cta_text || 'Explore Collections';
  const ctaLink = settings?.hero_cta_link || '/collections';
  const bgImage = settings?.hero_image || heroImage;

  return (
    <section className="relative min-h-[60vh] sm:min-h-[70vh] md:min-h-[85vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt={title}
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
      </div>

      <div className="relative container z-10">
        <div className="max-w-lg text-primary-foreground">
          <p className="font-display text-lg md:text-xl mb-2 text-gold-light tracking-wide">
            {subtitle}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
            ✨ {title.split(' ').slice(0, 1).join(' ')}
            <br />
            <span className="text-gold-light">{title.split(' ').slice(1).join(' ')}</span> ✨
          </h1>
          <p className="font-body text-sm md:text-base text-primary-foreground/80 mb-8 max-w-md leading-relaxed">
            {settings?.footer_description || 'Discover the finest collection of handcrafted sarees that blend traditional artistry with contemporary grace.'}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to={ctaLink}
              className="bg-primary hover:bg-burgundy-light text-primary-foreground px-6 sm:px-8 py-3 text-xs sm:text-sm tracking-[0.15em] font-body transition-all hover:shadow-lg"
            >
              {ctaText}
            </Link>
            <Link
              to="/about"
              className="border border-primary-foreground/40 text-primary-foreground px-6 sm:px-8 py-3 text-xs sm:text-sm tracking-[0.15em] font-body hover:bg-primary-foreground/10 transition-all"
            >
              Our Story
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
