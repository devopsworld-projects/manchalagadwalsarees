import { Link } from 'react-router-dom';

const fabrics = [
  {
    name: 'Kanjivaram Silk',
    description: 'The queen of silks, woven in Tamil Nadu with pure mulberry silk and real gold zari. Known for its durability and rich temple borders.',
    icon: '🏛️',
    slug: 'kanjivaram-sarees',
  },
  {
    name: 'Banarasi Silk',
    description: 'Mughal-inspired opulence from Varanasi. Famous for intricate brocade work featuring floral and foliate motifs in gold and silver.',
    icon: '✨',
    slug: 'banarasi-sarees',
  },
  {
    name: 'Mysore Silk',
    description: 'GI-tagged pure silk from Karnataka. Lightweight yet lustrous, with signature kasuti embroidery and understated elegance.',
    icon: '🦚',
    slug: 'mysore-silk-sarees',
  },
  {
    name: 'Chanderi',
    description: 'Sheer, lightweight fabric from Madhya Pradesh blending silk with cotton. Delicate texture perfect for everyday elegance.',
    icon: '🌸',
    slug: 'chanderi-cotton-silk',
  },
  {
    name: 'Sambalpuri Ikkat',
    description: "Odisha's tie-dye masterpiece. Threads are dyed before weaving to create mesmerizing geometric patterns and temple motifs.",
    icon: '🎨',
    slug: 'sambalpuri-sarees',
  },
  {
    name: 'Soft Cotton',
    description: 'Breathable, comfortable cotton sarees ideal for daily wear. Available in vibrant prints and traditional hand-block designs.',
    icon: '🌿',
    slug: 'south-cotton-sarees',
  },
];

export function FabricGuideSection() {
  return (
    <section className="py-20 md:py-28 relative kolam-texture">
      <div className="absolute top-0 left-0 right-0 ornate-line" />

      <div className="container">
        <div className="text-center mb-14">
          <span className="text-accent text-[8px]">◆ ◆ ◆</span>
          <h2 className="font-display text-2xl md:text-4xl font-bold mt-3 tracking-wide">
            The Connoisseur's Guide
          </h2>
          <div className="w-20 ornate-line mx-auto mt-4" />
          <p className="font-serif text-muted-foreground mt-4 max-w-lg mx-auto text-base italic">
            India's textile heritage spans millennia. Discover the story behind each weave.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {fabrics.map((fabric) => (
            <Link
              key={fabric.name}
              to={`/collections?filter=${fabric.slug}`}
              className="group relative p-7 bg-card border border-border hover:border-accent/50 hover:shadow-xl transition-all duration-300"
            >
              {/* Temple corner accents */}
              <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-accent/30 group-hover:border-accent/60 transition-colors" />
              <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-accent/30 group-hover:border-accent/60 transition-colors" />

              <span className="text-3xl mb-5 block">{fabric.icon}</span>
              <h3 className="font-display text-base md:text-lg font-bold mb-2 group-hover:text-primary transition-colors tracking-wider uppercase">
                {fabric.name}
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {fabric.description}
              </p>
              <div className="flex items-center gap-2 mt-5">
                <div className="w-4 h-[1px] bg-accent/50 group-hover:w-8 transition-all" />
                <span className="font-display text-[10px] text-accent tracking-[0.2em] uppercase">
                  Explore
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 ornate-line" />
    </section>
  );
}
