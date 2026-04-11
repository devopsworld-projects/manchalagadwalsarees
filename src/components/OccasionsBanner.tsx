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
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={flatlay}
          alt="Collection of luxurious silk sarees"
          className="w-full h-full object-cover"
          loading="lazy"
          width={1280}
          height={640}
        />
        <div className="absolute inset-0 bg-foreground/75 backdrop-blur-[2px]" />
      </div>

      <div className="relative container text-center z-10">
        <span className="font-body text-xs tracking-[0.3em] uppercase text-accent">
          For Every Moment
        </span>
        <h2 className="font-display text-3xl md:text-5xl font-bold text-background mt-3 mb-4">
          A Saree for Every Occasion
        </h2>
        <p className="font-body text-sm text-background/70 max-w-lg mx-auto mb-10">
          From grand celebrations to quiet everyday elegance — find the perfect drape for your story.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {occasions.map(occ => (
            <Link
              key={occ.name}
              to={`/collections?filter=${occ.filter}`}
              className="group bg-background/10 backdrop-blur-md border border-background/20 rounded-sm p-5 hover:bg-background/20 transition-all"
            >
              <span className="text-3xl md:text-4xl block mb-2">{occ.emoji}</span>
              <span className="font-display text-lg font-semibold text-background">{occ.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
