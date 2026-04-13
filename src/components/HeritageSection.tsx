import { Link } from 'react-router-dom';
import heritageImg from '@/assets/heritage-weaving.jpg';
import artisanImg from '@/assets/artisan-weaving.jpg';
import { motion } from 'framer-motion';

export function HeritageSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Full-width split: image left, dark content right */}
      <div className="flex flex-col md:flex-row min-h-[600px]">
        {/* Left — Full bleed image with overlapping artisan photo */}
        <div className="relative flex-1 min-h-[350px] md:min-h-0">
          <img
            src={heritageImg}
            alt="Handcrafted saree on mannequin"
            className="w-full h-full object-cover"
            loading="lazy"
            width={800}
            height={1024}
          />
          {/* Overlapping artisan image */}
          <div className="absolute -bottom-6 right-6 md:right-[-40px] w-40 md:w-56 z-20 hidden sm:block">
            <div className="border-2 border-accent/50 p-1 bg-background shadow-2xl">
              <img
                src={artisanImg}
                alt="Artisan weaving gold zari"
                className="w-full aspect-[4/3] object-cover"
                loading="lazy"
                width={400}
                height={300}
              />
            </div>
          </div>
          {/* Gradient fade into dark right panel */}
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-foreground to-transparent hidden md:block" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-foreground to-transparent md:hidden" />
        </div>

        {/* Right — Dark panel with content */}
        <div className="flex-1 bg-foreground px-8 md:px-16 lg:px-24 py-16 md:py-20 flex items-center">
          <div className="max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-accent text-[7px]">◆</span>
              <div className="w-8 h-[1px] bg-accent/40" />
              <span className="font-body text-[10px] tracking-[0.4em] uppercase text-accent/70">Our Heritage</span>
            </div>

            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-background tracking-wide leading-[1.1] mb-6">
              Woven with
              <br />
              <span className="gold-shimmer">Tradition</span>
            </h2>

            <div className="space-y-4 mb-8">
              <p className="font-serif text-sm md:text-base text-background/45 leading-relaxed italic">
                Every saree at Kavi Women's World tells a story — of artisans who have dedicated
                their lives to preserving centuries-old weaving traditions.
              </p>
              <p className="font-serif text-sm md:text-base text-background/45 leading-relaxed italic">
                We work directly with master weavers across South India, ensuring fair wages
                and the continuation of these sacred craft traditions.
              </p>
            </div>

            {/* Stats — horizontal strip */}
            <div className="grid grid-cols-4 gap-1 mb-8">
              {[
                { number: '500+', label: 'Artisans' },
                { number: '50+', label: 'Traditions' },
                { number: '100%', label: 'Handmade' },
                { number: '25+', label: 'Years' },
              ].map(stat => (
                <div key={stat.label} className="text-center py-3 border border-background/10">
                  <p className="font-display text-lg md:text-xl font-bold text-accent">{stat.number}</p>
                  <p className="font-body text-[8px] tracking-[0.2em] text-background/30 uppercase mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <Link
              to="/about"
              className="inline-block border-2 border-accent text-accent px-10 py-3.5 text-[11px] tracking-[0.3em] font-display uppercase hover:bg-accent hover:text-accent-foreground transition-all"
            >
              Discover Our Story
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom ornate line */}
      <div className="ornate-line" />
    </section>
  );
}
