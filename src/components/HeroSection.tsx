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
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/60 to-foreground/20" />
      </div>

      {/* Decorative corner elements */}
      <div className="absolute top-6 left-6 w-20 h-20 border-t-2 border-l-2 border-accent/40 hidden md:block" />
      <div className="absolute bottom-6 right-6 w-20 h-20 border-b-2 border-r-2 border-accent/40 hidden md:block" />

      <div className="relative container z-10">
        <div className="max-w-lg text-primary-foreground">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-[1px] bg-accent" />
            <p className="font-body text-xs tracking-[0.3em] uppercase text-accent">
              {subtitle}
            </p>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
            {title.split(' ').slice(0, 1).join(' ')}
            <br />
            <span className="gold-shimmer">{title.split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className="font-body text-sm md:text-base text-primary-foreground/80 mb-8 max-w-md leading-relaxed">
            {settings?.footer_description || 'Discover the finest collection of handcrafted sarees that blend traditional artistry with contemporary grace.'}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to={ctaLink}
              className="bg-accent text-accent-foreground px-6 sm:px-8 py-3 text-xs sm:text-sm tracking-[0.15em] font-body transition-all hover:shadow-lg hover:bg-accent/90"
            >
              {ctaText}
            </Link>
            <Link
              to="/about"
              className="border border-accent/50 text-primary-foreground px-6 sm:px-8 py-3 text-xs sm:text-sm tracking-[0.15em] font-body hover:bg-accent/10 transition-all"
            >
              Our Heritage
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-4 mt-8 text-primary-foreground/50">
            {['Handcrafted', 'Free Shipping', '100% Authentic'].map(badge => (
              <span key={badge} className="flex items-center gap-1.5 text-xs font-body">
                <span className="text-accent text-[10px]">◆</span> {badge}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gold border */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />
    </section>
  );
}
