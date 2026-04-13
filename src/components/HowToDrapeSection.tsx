import { ScrollReveal } from './ScrollReveal';
import niviImg from '@/assets/drape-nivi.jpg';
import bengaliImg from '@/assets/drape-bengali.jpg';
import gujaratiImg from '@/assets/drape-gujarati.jpg';
import maharashtriImg from '@/assets/drape-maharashtri.jpg';

const styles = [
  {
    name: 'Nivi Style',
    origin: 'Andhra Pradesh',
    image: niviImg,
    steps: [
      'Tuck the plain end into the petticoat at the navel',
      'Wrap once around the waist from right to left',
      'Make neat pleats (6-8) and tuck at the centre',
      'Drape the pallu over the left shoulder',
    ],
  },
  {
    name: 'Bengali Style',
    origin: 'West Bengal',
    image: bengaliImg,
    steps: [
      'Tuck the saree starting from the right side',
      'Wrap around the body without pleats',
      'Bring the pallu across the torso from right',
      'Throw the pallu over the left shoulder with key-hole drape',
    ],
  },
  {
    name: 'Gujarati Style',
    origin: 'Gujarat',
    image: gujaratiImg,
    steps: [
      'Tuck the end into the petticoat at the back',
      'Wrap once around, make front pleats and tuck',
      'Take the pallu from behind over the right shoulder',
      'Pin the pallu at the right shoulder, letting it drape in front',
    ],
  },
  {
    name: 'Maharashtrian Nauvari',
    origin: 'Maharashtra',
    image: maharashtriImg,
    steps: [
      'Hold the 9-yard saree at centre and make front pleats',
      'Wrap the right end between the legs to the back',
      'Tuck it firmly at the waist behind',
      'Drape the remaining fabric over the left shoulder',
    ],
  },
];

export function HowToDrapeSection() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 ornate-line" />

      <div className="container">
        <ScrollReveal>
          <div className="text-center mb-14">
            <span className="text-accent text-[8px]">◆ ◆ ◆</span>
            <h2 className="font-display text-2xl md:text-4xl font-bold mt-3 tracking-wide">
              The Art of Draping
            </h2>
            <div className="w-20 ornate-line mx-auto mt-4" />
            <p className="font-serif text-muted-foreground mt-4 max-w-lg mx-auto text-base italic">
              Every region of India has its own distinctive draping style. Master these timeless techniques.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-6">
          {styles.map((style, i) => (
            <ScrollReveal key={style.name} delay={i * 0.1} direction={i % 2 === 0 ? 'left' : 'right'}>
              <div className="group bg-card border border-border overflow-hidden hover:shadow-xl transition-shadow duration-300 relative">
                {/* Temple corners */}
                <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-accent/30 z-10" />
                <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-accent/30 z-10" />

                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-2/5 relative overflow-hidden">
                    <img
                      src={style.image}
                      alt={`${style.name} draping style from ${style.origin}`}
                      className="w-full h-48 sm:h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                      width={400}
                      height={500}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/60 to-transparent p-3 sm:hidden">
                      <h3 className="font-display text-base font-bold text-white tracking-wider">{style.name}</h3>
                    </div>
                  </div>
                  <div className="sm:w-3/5 p-6 flex flex-col justify-center">
                    <div className="hidden sm:block mb-4">
                      <h3 className="font-display text-lg font-bold tracking-wider">{style.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-4 h-[1px] bg-accent" />
                        <span className="font-body text-[10px] text-accent tracking-[0.2em] uppercase">{style.origin}</span>
                      </div>
                    </div>
                    <ol className="space-y-2.5">
                      {style.steps.map((step, si) => (
                        <li key={si} className="flex items-start gap-3 font-body text-sm text-muted-foreground">
                          <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary flex items-center justify-center text-xs font-display font-bold">
                            {si + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 ornate-line" />
    </section>
  );
}
