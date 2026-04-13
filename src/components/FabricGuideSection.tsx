import { Link } from 'react-router-dom';

const fabrics = [
  {
    name: 'Kanjivaram Silk',
    description: 'The queen of silks, woven in Tamil Nadu with pure mulberry silk and real gold zari.',
    icon: '🏛️',
    slug: 'kanjivaram-sarees',
    highlight: true,
  },
  {
    name: 'Banarasi Silk',
    description: 'Mughal-inspired opulence from Varanasi with intricate brocade work in gold and silver.',
    icon: '✨',
    slug: 'banarasi-sarees',
    highlight: true,
  },
  {
    name: 'Mysore Silk',
    description: 'GI-tagged pure silk from Karnataka. Lightweight yet lustrous with kasuti embroidery.',
    icon: '🦚',
    slug: 'mysore-silk-sarees',
    highlight: false,
  },
  {
    name: 'Chanderi',
    description: 'Sheer, lightweight from Madhya Pradesh. Silk-cotton blend with delicate texture.',
    icon: '🌸',
    slug: 'chanderi-cotton-silk',
    highlight: false,
  },
  {
    name: 'Sambalpuri Ikkat',
    description: "Odisha's tie-dye masterpiece with mesmerizing geometric patterns.",
    icon: '🎨',
    slug: 'sambalpuri-sarees',
    highlight: false,
  },
  {
    name: 'Soft Cotton',
    description: 'Breathable cotton sarees ideal for daily wear in vibrant hand-block designs.',
    icon: '🌿',
    slug: 'south-cotton-sarees',
    highlight: false,
  },
];

export function FabricGuideSection() {
  const highlighted = fabrics.filter(f => f.highlight);
  const others = fabrics.filter(f => !f.highlight);

  return (
    <section className="py-20 md:py-28 bg-foreground relative overflow-hidden">
      {/* Subtle mandala background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-accent/30 rounded-full" />
        <div className="absolute top-1/2 right-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-accent/30 rounded-full" />
      </div>

      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-[1px] bg-accent/40" />
            <span className="font-body text-[10px] tracking-[0.4em] uppercase text-accent/70">Know Your Fabrics</span>
            <div className="w-10 h-[1px] bg-accent/40" />
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-background tracking-wide">
            The Connoisseur's Guide
          </h2>
          <p className="font-serif text-base text-background/35 italic mt-4 max-w-md mx-auto">
            India's textile heritage spans millennia. Discover the story behind each weave.
          </p>
        </div>

        {/* Featured fabrics — large editorial cards */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-6">
          {highlighted.map(fabric => (
            <Link
              key={fabric.name}
              to={`/collections?filter=${fabric.slug}`}
              className="group relative p-8 md:p-10 border border-background/10 hover:border-accent/40 transition-all duration-500"
            >
              {/* Corner ornaments */}
              <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-accent/30 group-hover:border-accent/60 transition-colors" />
              <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-accent/30 group-hover:border-accent/60 transition-colors" />

              <span className="text-4xl mb-6 block">{fabric.icon}</span>
              <h3 className="font-display text-xl md:text-2xl font-bold text-background tracking-wider uppercase mb-3 group-hover:text-accent transition-colors">
                {fabric.name}
              </h3>
              <p className="font-body text-sm text-background/40 leading-relaxed mb-6">
                {fabric.description}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-6 h-[1px] bg-accent/40 group-hover:w-12 transition-all duration-500" />
                <span className="font-display text-[10px] text-accent tracking-[0.3em] uppercase">Explore</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Other fabrics — compact row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {others.map(fabric => (
            <Link
              key={fabric.name}
              to={`/collections?filter=${fabric.slug}`}
              className="group p-5 border border-background/8 hover:border-accent/30 transition-all duration-300"
            >
              <span className="text-2xl mb-3 block">{fabric.icon}</span>
              <h3 className="font-display text-xs font-bold text-background/80 tracking-[0.15em] uppercase mb-1 group-hover:text-accent transition-colors">
                {fabric.name}
              </h3>
              <p className="font-body text-[11px] text-background/30 leading-relaxed line-clamp-2">
                {fabric.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 ornate-line" />
    </section>
  );
}
