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
  },
  {
    name: 'Chanderi',
    description: 'Sheer, lightweight from Madhya Pradesh. Silk-cotton blend with delicate texture.',
    icon: '🌸',
    slug: 'chanderi-cotton-silk',
  },
  {
    name: 'Sambalpuri Ikkat',
    description: "Odisha's tie-dye masterpiece with mesmerizing geometric patterns.",
    icon: '🎨',
    slug: 'sambalpuri-sarees',
  },
  {
    name: 'Soft Cotton',
    description: 'Breathable cotton sarees ideal for daily wear in vibrant hand-block designs.',
    icon: '🌿',
    slug: 'south-cotton-sarees',
  },
];

export function FabricGuideSection() {
  const highlighted = fabrics.filter(f => f.highlight);
  const others = fabrics.filter(f => !f.highlight);

  return (
    <section className="py-24 md:py-32 bg-foreground relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute top-20 left-[10%] w-[400px] h-[400px] border border-accent rounded-full" />
        <div className="absolute bottom-20 right-[10%] w-[300px] h-[300px] border border-accent rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-accent/50 rounded-full" />
      </div>

      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <span className="text-accent text-[8px] tracking-[0.5em]">◆&nbsp;&nbsp;◆&nbsp;&nbsp;◆</span>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-background mt-4 tracking-wide">
            Know Your Fabrics
          </h2>
          <div className="w-20 ornate-line mx-auto mt-5" />
          <p className="font-serif text-base md:text-lg text-background/40 italic mt-4 max-w-lg mx-auto">
            India's textile heritage spans millennia. Discover the story behind each weave.
          </p>
        </div>

        {/* Featured fabrics — large side by side */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-5 mb-5">
          {highlighted.map(fabric => (
            <Link
              key={fabric.name}
              to={`/collections?filter=${fabric.slug}`}
              className="group relative p-8 md:p-12 border border-background/10 hover:border-accent/40 transition-all duration-500 bg-background/[0.02]"
            >
              {/* Corner ornaments */}
              <div className="absolute top-3 left-3 w-6 h-6 border-t border-l border-accent/25 group-hover:border-accent/60 transition-colors" />
              <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-accent/25 group-hover:border-accent/60 transition-colors" />

              <span className="text-4xl md:text-5xl mb-6 block">{fabric.icon}</span>
              <h3 className="font-display text-xl md:text-2xl font-bold text-background tracking-wider uppercase mb-3 group-hover:text-accent transition-colors">
                {fabric.name}
              </h3>
              <p className="font-body text-sm md:text-base text-background/40 leading-relaxed mb-8">
                {fabric.description}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-6 h-[1px] bg-accent/40 group-hover:w-12 transition-all duration-500" />
                <span className="font-display text-[10px] text-accent tracking-[0.3em] uppercase">Explore Collection</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Other fabrics — compact grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {others.map(fabric => (
            <Link
              key={fabric.name}
              to={`/collections?filter=${fabric.slug}`}
              className="group p-5 md:p-6 border border-background/8 hover:border-accent/30 transition-all duration-300 bg-background/[0.02]"
            >
              <span className="text-2xl md:text-3xl mb-3 block">{fabric.icon}</span>
              <h3 className="font-display text-xs md:text-sm font-bold text-background/80 tracking-[0.12em] uppercase mb-2 group-hover:text-accent transition-colors">
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
