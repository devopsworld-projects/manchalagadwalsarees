import { Link } from 'react-router-dom';
import heritageImg from '@/assets/heritage-weaving.jpg';
import artisanImg from '@/assets/artisan-weaving.jpg';

export function HeritageSection() {
  return (
    <section className="py-16 md:py-24 bg-primary/[0.03] relative overflow-hidden">
      {/* Decorative border top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-40" />

      <div className="container">
        <div className="text-center mb-12">
          <span className="font-body text-xs tracking-[0.3em] uppercase text-accent">Our Heritage</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mt-2">
            Woven with <span className="text-accent italic">Tradition</span>
          </h2>
          <div className="w-16 h-[2px] bg-accent mx-auto mt-4" />
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left — Image stack */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src={heritageImg}
                alt="Handcrafted saree on mannequin in traditional palace setting"
                className="w-full rounded-sm shadow-xl"
                loading="lazy"
                width={800}
                height={1024}
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-2/3 z-20 hidden md:block">
              <img
                src={artisanImg}
                alt="Artisan weaving gold zari on a traditional handloom"
                className="w-full rounded-sm shadow-2xl border-4 border-background"
                loading="lazy"
                width={800}
                height={640}
              />
            </div>
            {/* Decorative corner */}
            <div className="absolute -top-3 -left-3 w-16 h-16 border-t-2 border-l-2 border-accent/50 rounded-tl-sm" />
          </div>

          {/* Right — Content */}
          <div className="md:pl-8 lg:pl-16 space-y-6">
            <div className="space-y-4">
              <p className="font-body text-muted-foreground leading-relaxed">
                Every saree at Kavi Women's World tells a story — of artisans who have dedicated
                their lives to preserving centuries-old weaving traditions. From the lustrous silk
                of Kanjivaram to the intricate brocade of Banarasi, each piece is a testament to
                India's unparalleled textile heritage.
              </p>
              <p className="font-body text-muted-foreground leading-relaxed">
                We work directly with master weavers across South India, ensuring fair wages
                and the continuation of these sacred craft traditions for generations to come.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-2 gap-4 py-4">
              {[
                { number: '500+', label: 'Artisan Families' },
                { number: '50+', label: 'Weaving Traditions' },
                { number: '100%', label: 'Handcrafted' },
                { number: '25+', label: 'Years of Legacy' },
              ].map(stat => (
                <div key={stat.label} className="text-center p-3 bg-background rounded-sm border border-border">
                  <p className="font-display text-2xl md:text-3xl font-bold text-primary">{stat.number}</p>
                  <p className="font-body text-xs text-muted-foreground tracking-wider mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <Link
              to="/about"
              className="inline-block border border-primary text-primary px-8 py-3 text-xs tracking-[0.15em] font-body uppercase hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Discover Our Story
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative border bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-40" />
    </section>
  );
}
