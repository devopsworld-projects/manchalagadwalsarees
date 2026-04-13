import { Link } from 'react-router-dom';
import heritageImg from '@/assets/heritage-weaving.jpg';
import artisanImg from '@/assets/artisan-weaving.jpg';
import { motion } from 'framer-motion';

export function HeritageSection() {
  const stats = [
    { number: '500+', label: 'Artisans' },
    { number: '50+', label: 'Traditions' },
    { number: '100%', label: 'Handmade' },
    { number: '25+', label: 'Years' },
  ];

  return (
    <section className="relative overflow-hidden bg-foreground">
      {/* Full-width cinematic layout */}
      <div className="relative min-h-[700px] md:min-h-[800px]">
        {/* Background image with parallax feel */}
        <div className="absolute inset-0">
          <img
            src={heritageImg}
            alt="Handcrafted saree"
            className="w-full h-full object-cover"
            loading="lazy"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/85 to-foreground/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        </div>

        {/* Content overlay */}
        <div className="relative z-10 container h-full flex items-center py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center w-full">
            {/* Left — Text content */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-accent text-[7px]">◆</span>
                <div className="w-10 h-[1px] bg-accent/40" />
                <span className="font-body text-[10px] tracking-[0.4em] uppercase text-accent/80">Our Heritage</span>
              </div>

              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-background tracking-wide leading-[1.05] mb-8">
                Woven with
                <br />
                <span className="gold-shimmer">Tradition</span>
              </h2>

              <div className="space-y-4 mb-10">
                <p className="font-serif text-base md:text-lg text-background/50 leading-relaxed italic">
                  Every saree at Kavi Women's World tells a story — of artisans who have dedicated
                  their lives to preserving centuries-old weaving traditions.
                </p>
                <p className="font-serif text-base text-background/40 leading-relaxed italic">
                  We work directly with master weavers across South India, ensuring fair wages
                  and the continuation of these sacred craft traditions.
                </p>
              </div>

              {/* Stats row */}
              <div className="flex gap-1 mb-10">
                {stats.map(stat => (
                  <div key={stat.label} className="flex-1 text-center py-4 border border-background/10 bg-background/5 backdrop-blur-sm">
                    <p className="font-display text-xl md:text-2xl font-bold text-accent">{stat.number}</p>
                    <p className="font-body text-[8px] tracking-[0.2em] text-background/35 uppercase mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              <Link
                to="/about"
                className="inline-block border border-accent text-accent px-12 py-4 text-[11px] tracking-[0.3em] font-display uppercase hover:bg-accent hover:text-accent-foreground transition-all relative"
              >
                Discover Our Story
                <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary" />
                <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-primary" />
              </Link>
            </div>

            {/* Right — Artisan image with decorative frame */}
            <div className="relative hidden md:block">
              <div className="relative">
                {/* Main artisan image */}
                <div className="relative border-2 border-accent/20 p-2">
                  <img
                    src={artisanImg}
                    alt="Artisan weaving gold zari"
                    className="w-full aspect-[4/5] object-cover"
                    loading="lazy"
                    width={600}
                    height={750}
                  />
                  {/* Corner ornaments */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-accent" />
                  <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-accent" />
                </div>

                {/* Floating accent element */}
                <div className="absolute -bottom-8 -left-8 bg-accent text-accent-foreground p-6 shadow-2xl">
                  <p className="font-display text-3xl font-bold">25+</p>
                  <p className="font-body text-[9px] tracking-[0.2em] uppercase">Years of Heritage</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="ornate-line" />
    </section>
  );
}
