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
    description: 'Odisha\'s tie-dye masterpiece. Threads are dyed before weaving to create mesmerizing geometric patterns and temple motifs.',
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
    <section className="py-16 md:py-24 relative">
      <div className="container">
        <div className="text-center mb-12">
          <span className="font-body text-xs tracking-[0.3em] uppercase text-accent">Know Your Fabrics</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mt-2">
            The Saree <span className="text-primary italic">Connoisseur's</span> Guide
          </h2>
          <div className="w-16 h-[2px] bg-accent mx-auto mt-4" />
          <p className="font-body text-muted-foreground mt-4 max-w-lg mx-auto text-sm">
            India's textile heritage spans millennia. Discover the story behind each weave.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {fabrics.map((fabric) => (
            <Link
              key={fabric.name}
              to={`/collections?filter=${fabric.slug}`}
              className="group relative p-6 bg-card border border-border rounded-sm hover:border-accent/50 hover:shadow-lg transition-all duration-300"
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="text-3xl mb-4 block">{fabric.icon}</span>
              <h3 className="font-display text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                {fabric.name}
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {fabric.description}
              </p>
              <span className="font-body text-xs text-accent mt-4 inline-block tracking-wider group-hover:tracking-[0.2em] transition-all">
                EXPLORE →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
