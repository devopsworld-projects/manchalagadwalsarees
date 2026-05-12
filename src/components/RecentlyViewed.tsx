import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCurrency } from '@/context/CurrencyContext';
import { supabase } from '@/integrations/supabase/client';

type RecentItem = { id: string; name: string; image: string; price: number; sku: string };

export function RecentlyViewed({ currentSku }: { currentSku?: string }) {
  const [items, setItems] = useState<RecentItem[]>([]);
  const { format } = useCurrency();
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let stored: RecentItem[] = [];
      try {
        stored = JSON.parse(localStorage.getItem('recently-viewed') || '[]') as RecentItem[];
      } catch {
        stored = [];
      }

      // Filter obviously bad entries
      stored = stored.filter(
        i => i && i.sku && i.name && i.image && typeof i.price === 'number'
      );

      const candidates = stored.filter(i => i.sku !== currentSku);
      if (candidates.length === 0) {
        if (!cancelled) setItems([]);
        return;
      }

      // Validate against DB — drop items whose product was deleted/deactivated
      const skus = candidates.map(i => i.sku);
      const { data } = await supabase
        .from('products')
        .select('sku')
        .in('sku', skus)
        .eq('is_active', true);

      const validSkus = new Set((data || []).map(p => p.sku));
      const valid = candidates.filter(i => validSkus.has(i.sku)).slice(0, 6);

      // Persist cleaned list back to localStorage
      try {
        const cleanedAll = stored.filter(i => validSkus.has(i.sku) || i.sku === currentSku);
        localStorage.setItem('recently-viewed', JSON.stringify(cleanedAll));
      } catch {}

      if (!cancelled) setItems(valid);
    })();

    return () => {
      cancelled = true;
    };
  }, [currentSku, location.pathname]);

  if (items.length === 0) return null;

  const clearAll = () => {
    try {
      localStorage.removeItem('recently-viewed');
    } catch {}
    setItems([]);
  };

  return (
    <section className="py-8 border-t border-border mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-bold">Recently Viewed</h2>
        <button
          onClick={clearAll}
          className="text-xs font-body text-muted-foreground hover:text-accent transition-colors uppercase tracking-wider"
        >
          Clear
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {items.map(item => (
          <Link key={item.sku} to={`/product/${item.sku}`} className="group">
            <div className="aspect-[3/4] overflow-hidden rounded bg-muted mb-2">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                onError={e => {
                  (e.currentTarget as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            </div>
            <p className="font-body text-xs truncate">{item.name}</p>
            <p className="font-body text-xs font-bold">{format(item.price)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function addToRecentlyViewed(item: RecentItem) {
  if (!item || !item.sku || !item.name || !item.image) return;
  try {
    const stored = JSON.parse(localStorage.getItem('recently-viewed') || '[]') as RecentItem[];
    const filtered = stored.filter(i => i && i.sku && i.sku !== item.sku);
    filtered.unshift(item);
    localStorage.setItem('recently-viewed', JSON.stringify(filtered.slice(0, 20)));
  } catch {}
}
