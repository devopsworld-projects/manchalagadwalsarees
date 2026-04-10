import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-woman.jpg';

export function HeroSection() {
  return (
    <section className="relative min-h-[70vh] md:min-h-[85vh] flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Kavi Women's World"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container z-10">
        <div className="max-w-lg text-primary-foreground">
          <p className="font-display text-lg md:text-xl mb-2 text-gold-light tracking-wide">
            Elegance in Every Drape
          </p>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
            ✨ Kavi
            <br />
            <span className="text-gold-light">Women's World</span> ✨
          </h1>
          <p className="font-body text-sm md:text-base text-primary-foreground/80 mb-8 max-w-md leading-relaxed">
            Discover the finest collection of handcrafted sarees that blend
            traditional artistry with contemporary grace.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/collections"
              className="bg-primary hover:bg-burgundy-light text-primary-foreground px-8 py-3 text-sm tracking-[0.15em] font-body transition-all hover:shadow-lg"
            >
              Explore Collections
            </Link>
            <Link
              to="/about"
              className="border border-primary-foreground/40 text-primary-foreground px-8 py-3 text-sm tracking-[0.15em] font-body hover:bg-primary-foreground/10 transition-all"
            >
              Our Story
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
