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
    <section className="py-16 md:py-24 bg-primary/[0.03] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-40" />

      <div className="container">
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="font-body text-xs tracking-[0.3em] uppercase text-accent">Style Guide</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold mt-2">
              The Art of <span className="text-primary italic">Draping</span>
            </h2>
            <div className="w-16 h-[2px] bg-accent mx-auto mt-4" />
            <p className="font-body text-muted-foreground mt-4 max-w-lg mx-auto text-sm">
              Every region of India has its own distinctive draping style. Master these timeless techniques.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8">
          {styles.map((style, i) => (
            <ScrollReveal key={style.name} delay={i * 0.1} direction={i % 2 === 0 ? 'left' : 'right'}>
              <div className="group bg-card border border-border rounded-sm overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-2/5 relative overflow-hidden">
                    <img
                      src={style.image}
                      alt={`${style.name} draping style from ${style.origin}`}
                      className="w-full h-48 sm:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      width={400}
                      height={500}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 sm:hidden">
                      <h3 className="font-display text-lg font-bold text-white">{style.name}</h3>
                    </div>
                  </div>
                  <div className="sm:w-3/5 p-5 flex flex-col justify-center">
                    <div className="hidden sm:block">
                      <h3 className="font-display text-xl font-bold mb-1">{style.name}</h3>
                      <span className="font-body text-xs text-accent tracking-wider">{style.origin}</span>
                    </div>
                    <ol className="mt-3 space-y-2">
                      {style.steps.map((step, si) => (
                        <li key={si} className="flex items-start gap-3 font-body text-sm text-muted-foreground">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold">
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

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-40" />
    </section>
  );
}
