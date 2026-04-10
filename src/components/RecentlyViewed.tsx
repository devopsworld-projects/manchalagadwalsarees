import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type RecentItem = { id: string; name: string; image: string; price: number; sku: string };

export function RecentlyViewed({ currentSku }: { currentSku?: string }) {
  const [items, setItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('recently-viewed') || '[]') as RecentItem[];
      setItems(stored.filter(i => i.sku !== currentSku).slice(0, 6));
    } catch { setItems([]); }
  }, [currentSku]);

  if (items.length === 0) return null;

  return (
    <section className="py-8 border-t border-border mt-8">
      <h2 className="font-display text-xl font-bold mb-4">Recently Viewed</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {items.map(item => (
          <Link key={item.sku} to={`/product/${item.sku}`} className="group">
            <div className="aspect-[3/4] overflow-hidden rounded bg-muted mb-2">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            </div>
            <p className="font-body text-xs truncate">{item.name}</p>
            <p className="font-body text-xs font-bold">₹{item.price.toLocaleString()}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function addToRecentlyViewed(item: RecentItem) {
  try {
    const stored = JSON.parse(localStorage.getItem('recently-viewed') || '[]') as RecentItem[];
    const filtered = stored.filter(i => i.sku !== item.sku);
    filtered.unshift(item);
    localStorage.setItem('recently-viewed', JSON.stringify(filtered.slice(0, 20)));
  } catch {}
}
