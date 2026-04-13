import { Link } from 'react-router-dom';
import heritageImg from '@/assets/heritage-weaving.jpg';
import artisanImg from '@/assets/artisan-weaving.jpg';

export function HeritageSection() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Left — Image composition */}
          <div className="relative">
            {/* Temple frame around main image */}
            <div className="relative z-10 p-2 border border-accent/30">
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-accent" />
              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-accent" />
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-accent" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-accent" />
              <img
                src={heritageImg}
                alt="Handcrafted saree on mannequin in traditional palace setting"
                className="w-full"
                loading="lazy"
                width={800}
                height={1024}
              />
            </div>
            {/* Overlapping artisan image */}
            <div className="absolute -bottom-8 -right-4 w-2/3 z-20 hidden md:block">
              <div className="p-1.5 border border-accent/40 bg-background shadow-2xl">
                <img
                  src={artisanImg}
                  alt="Artisan weaving gold zari on a traditional handloom"
                  className="w-full"
                  loading="lazy"
                  width={800}
                  height={640}
                />
              </div>
            </div>
          </div>

          {/* Right — Content */}
          <div className="md:pl-8 lg:pl-12 space-y-6">
            <div>
              <span className="text-accent text-[8px]">◆ ◆ ◆</span>
              <h2 className="font-display text-2xl md:text-4xl font-bold mt-3 tracking-wide">
                Woven with Tradition
              </h2>
              <div className="w-16 ornate-line mt-4" />
            </div>

            <div className="space-y-4 temple-pillar-border pl-5">
              <p className="font-serif text-foreground/70 leading-relaxed text-base italic">
                Every saree at Kavi Women's World tells a story — of artisans who have dedicated
                their lives to preserving centuries-old weaving traditions. From the lustrous silk
                of Kanjivaram to the intricate brocade of Banarasi, each piece is a testament to
                India's unparalleled textile heritage.
              </p>
              <p className="font-serif text-foreground/70 leading-relaxed text-base italic">
                We work directly with master weavers across South India, ensuring fair wages
                and the continuation of these sacred craft traditions for generations to come.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 py-4">
              {[
                { number: '500+', label: 'Artisan Families' },
                { number: '50+', label: 'Weaving Traditions' },
                { number: '100%', label: 'Handcrafted' },
                { number: '25+', label: 'Years of Legacy' },
              ].map(stat => (
                <div key={stat.label} className="text-center p-4 bg-background border border-border relative">
                  <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-accent/40" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-accent/40" />
                  <p className="font-display text-xl md:text-2xl font-bold text-primary">{stat.number}</p>
                  <p className="font-body text-[10px] text-muted-foreground tracking-[0.15em] mt-1 uppercase">{stat.label}</p>
                </div>
              ))}
            </div>

            <Link
              to="/about"
              className="inline-block border-2 border-primary text-primary px-10 py-3.5 text-xs tracking-[0.25em] font-display uppercase hover:bg-primary hover:text-primary-foreground transition-all"
            >
              Discover Our Story
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
