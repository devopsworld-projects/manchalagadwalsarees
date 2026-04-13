import { Link } from 'react-router-dom';
import flatlay from '@/assets/saree-collection-flatlay.jpg';

const occasions = [
  { name: 'Weddings', emoji: '💍', filter: 'wedding-sarees', desc: 'Grand celebration pieces' },
  { name: 'Festivals', emoji: '🪔', filter: 'best-sellers', desc: 'Vibrant festive drapes' },
  { name: 'Daily Wear', emoji: '🌸', filter: 'south-cotton-sarees', desc: 'Elegant everyday sarees' },
  { name: 'Gifting', emoji: '🎁', filter: 'new-arrivals', desc: 'Perfect for loved ones' },
];

export function OccasionsBanner() {
  return (
    <section className="relative py-28 md:py-36 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={flatlay}
          alt="Collection of luxurious silk sarees"
          className="w-full h-full object-cover"
          loading="lazy"
          width={1920}
          height={800}
        />
        <div className="absolute inset-0 bg-foreground/85" />
      </div>

      <div className="absolute top-0 left-0 right-0 ornate-line" />
      <div className="absolute bottom-0 left-0 right-0 ornate-line" />

      {/* Decorative frame */}
      <div className="absolute inset-8 md:inset-16 pointer-events-none">
        <div className="absolute top-0 left-0 w-10 h-10 border-t border-l border-accent/30" />
        <div className="absolute top-0 right-0 w-10 h-10 border-t border-r border-accent/30" />
        <div className="absolute bottom-0 left-0 w-10 h-10 border-b border-l border-accent/30" />
        <div className="absolute bottom-0 right-0 w-10 h-10 border-b border-r border-accent/30" />
      </div>

      <div className="relative container text-center z-10">
        <span className="text-accent text-[8px] tracking-[0.5em]">◆&nbsp;&nbsp;◆&nbsp;&nbsp;◆</span>
        <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-background mt-4 tracking-wide">
          A Saree for Every Occasion
        </h2>
        <div className="w-20 ornate-line mx-auto mt-5 mb-4" />
        <p className="font-serif text-base md:text-lg text-background/45 max-w-xl mx-auto mb-14 italic">
          From grand celebrations to quiet everyday elegance — find the perfect drape for your story.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 max-w-4xl mx-auto">
          {occasions.map(occ => (
            <Link
              key={occ.name}
              to={`/collections?filter=${occ.filter}`}
              className="group relative bg-background/5 backdrop-blur-md border border-accent/15 p-8 md:p-10 hover:bg-background/10 hover:border-accent/50 transition-all duration-300"
            >
              <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-accent/30 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-accent/30 opacity-0 group-hover:opacity-100 transition-opacity" />

              <span className="text-4xl md:text-5xl block mb-4">{occ.emoji}</span>
              <span className="font-display text-sm md:text-base font-bold text-background tracking-wider block mb-2">
                {occ.name}
              </span>
              <span className="font-body text-[10px] text-background/35 tracking-wider">
                {occ.desc}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
