import { Link } from 'react-router-dom';
import flatlay from '@/assets/saree-collection-flatlay.jpg';

const occasions = [
  { name: 'Weddings', emoji: '💍', filter: 'wedding-sarees' },
  { name: 'Festivals', emoji: '🪔', filter: 'best-sellers' },
  { name: 'Daily Wear', emoji: '🌸', filter: 'south-cotton-sarees' },
  { name: 'Gifting', emoji: '🎁', filter: 'new-arrivals' },
];

export function OccasionsBanner() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={flatlay}
          alt="Collection of luxurious silk sarees"
          className="w-full h-full object-cover"
          loading="lazy"
          width={1280}
          height={640}
        />
        <div className="absolute inset-0 bg-foreground/80" />
      </div>

      {/* Ornate borders */}
      <div className="absolute top-0 left-0 right-0 ornate-line" />
      <div className="absolute bottom-0 left-0 right-0 ornate-line" />

      <div className="relative container text-center z-10">
        <span className="text-accent text-[8px]">◆ ◆ ◆</span>
        <h2 className="font-display text-2xl md:text-5xl font-bold text-background mt-3 tracking-wide">
          A Saree for Every Occasion
        </h2>
        <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mt-4 mb-4" />
        <p className="font-serif text-sm md:text-base text-background/50 max-w-lg mx-auto mb-12 italic">
          From grand celebrations to quiet everyday elegance — find the perfect drape for your story.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {occasions.map(occ => (
            <Link
              key={occ.name}
              to={`/collections?filter=${occ.filter}`}
              className="group relative bg-background/5 backdrop-blur-md border border-accent/20 p-6 md:p-8 hover:bg-background/10 hover:border-accent/50 transition-all duration-300"
            >
              {/* Corner accents */}
              <div className="absolute top-1 left-1 w-3 h-3 border-t border-l border-accent/40 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-1 right-1 w-3 h-3 border-b border-r border-accent/40 opacity-0 group-hover:opacity-100 transition-opacity" />

              <span className="text-3xl md:text-4xl block mb-3">{occ.emoji}</span>
              <span className="font-display text-sm md:text-base font-bold text-background tracking-wider">{occ.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
