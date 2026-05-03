import { Link } from 'react-router-dom';
import heritageImg from '@/assets/heritage-weaving.jpg';
import artisanImg from '@/assets/artisan-weaving.jpg';

export function HeritageSection() {
  const stats = [
    { number: '500+', label: 'Master Artisans' },
    { number: '50+', label: 'Living Traditions' },
    { number: '25', label: 'Years of Heritage' },
  ];

  return (
    <section className="relative bg-background py-24 md:py-36 overflow-hidden">
      <div className="container">
        {/* Editorial split */}
        <div className="grid lg:grid-cols-12 gap-10 md:gap-16 items-stretch">
          {/* Left — text column */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="flex items-baseline gap-5 mb-6">
              <span className="font-display text-[42px] md:text-[64px] leading-none font-light text-accent/50">
                III.
              </span>
              <div className="flex items-center gap-3">
                <div className="w-10 h-px bg-accent" />
                <span className="font-body text-[10px] tracking-luxe uppercase text-accent">
                  Our Heritage
                </span>
              </div>
            </div>

            <h2 className="font-display text-[44px] sm:text-[60px] md:text-[78px] leading-[0.95] font-medium tracking-[-0.01em] text-foreground mb-8">
              Woven with
              <br />
              <span className="italic font-serif font-normal text-accent">devotion,</span>
              <br />
              passed by
              <br />
              <span className="italic font-serif font-normal text-accent">hand.</span>
            </h2>

            <p className="font-serif text-base md:text-lg text-muted-foreground leading-relaxed italic mb-6 max-w-md">
              Every saree at Manchala Gadwal Sarees tells a story — of artisans who
              have dedicated their lives to preserving centuries-old weaving traditions.
            </p>
            <p className="font-serif text-sm md:text-base text-muted-foreground/80 leading-relaxed italic mb-10 max-w-md">
              We work directly with master weavers across South India, ensuring fair
              wages and the continuation of these sacred craft traditions.
            </p>

            <Link
              to="/about"
              className="btn-luxe self-start bg-foreground text-background px-12 py-[18px] text-[10px] tracking-luxe font-display uppercase hover:bg-accent hover:text-accent-foreground transition-all"
            >
              Discover Our Story
            </Link>
          </div>

          {/* Right — editorial image stack */}
          <div className="lg:col-span-7 relative">
            <div className="grid grid-cols-12 gap-3 md:gap-5">
              {/* Tall image */}
              <div className="col-span-7 image-luxe overflow-hidden">
                <img
                  src={heritageImg}
                  alt="Handcrafted saree on the loom"
                  className="w-full aspect-[3/4] object-cover"
                  loading="lazy"
                  width={800}
                  height={1067}
                />
              </div>
              {/* Right column with smaller image + stat block */}
              <div className="col-span-5 flex flex-col gap-3 md:gap-5">
                <div className="image-luxe overflow-hidden flex-1">
                  <img
                    src={artisanImg}
                    alt="Artisan weaving zari"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width={500}
                    height={500}
                  />
                </div>
                <div className="bg-foreground text-background p-6 md:p-8 flex flex-col justify-center">
                  <p className="font-display text-5xl md:text-6xl leading-none font-medium text-accent">
                    25
                  </p>
                  <p className="font-body text-[9px] tracking-luxe uppercase text-background/70 mt-3">
                    Years of
                    <br />
                    Heritage
                  </p>
                </div>
              </div>
            </div>

            {/* Stats row below */}
            <div className="grid grid-cols-3 gap-px bg-border mt-5 border border-border">
              {stats.map(stat => (
                <div key={stat.label} className="bg-background py-6 md:py-8 px-4 text-center">
                  <p className="font-display text-2xl md:text-3xl text-foreground font-medium">{stat.number}</p>
                  <p className="font-body text-[9px] tracking-luxe text-muted-foreground uppercase mt-2">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
