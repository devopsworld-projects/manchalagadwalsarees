/**
 * Editorial marquee — slowly scrolling display strip placed between
 * major homepage sections. Reinforces the heritage voice without
 * distracting from product content.
 */
const phrases = [
  'Handwoven in Telangana',
  '✦',
  'Pure Zari · Temple Borders',
  '✦',
  'Master Weavers Since Generations',
  '✦',
  'Bridal · Festive · Heirloom',
  '✦',
  'Crafted with Devotion',
  '✦',
];

export function EditorialMarquee() {
  const loop = [...phrases, ...phrases, ...phrases];
  return (
    <div className="relative overflow-hidden bg-foreground border-y border-accent/15 py-7 md:py-9">
      <div className="flex animate-marquee whitespace-nowrap">
        {loop.map((p, i) => (
          <span
            key={i}
            className={`font-display text-[28px] md:text-[44px] leading-none mx-8 ${
              p === '✦' ? 'text-accent' : 'text-background/85 italic'
            }`}
            style={{ fontStyle: p === '✦' ? 'normal' : 'italic' }}
          >
            {p}
          </span>
        ))}
      </div>
    </div>
  );
}
