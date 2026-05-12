import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { useCurrency } from '@/context/CurrencyContext';

type ProductResult = {
  id: string;
  name: string;
  price: number;
  images: string[] | null;
  category_id: string | null;
};

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ProductResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const timeout = setTimeout(async () => {
      setLoading(true);
      const { data } = await supabase
        .from('products')
        .select('id, name, price, images, category_id')
        .ilike('name', `%${query}%`)
        .eq('is_active', true)
        .limit(8);
      setResults(data || []);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="mx-auto mt-20 w-[90%] max-w-lg bg-background rounded-lg shadow-2xl border border-border overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 border-b border-border">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <Input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search sarees..."
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-12 text-sm"
          />
          <button onClick={onClose} className="p-1 hover:text-foreground text-muted-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[50vh] overflow-y-auto">
          {loading && (
            <p className="text-xs text-muted-foreground text-center py-6">Searching...</p>
          )}
          {!loading && query.trim() && results.length === 0 && (
            <div className="text-center py-10 px-6">
              <span className="text-accent text-3xl block mb-3">◆</span>
              <p className="font-display text-sm font-bold text-foreground mb-1">
                No sarees match "{query}"
              </p>
              <p className="text-xs text-muted-foreground font-body mb-4">
                Try a different keyword like a fabric, color or category — or browse our full collection.
              </p>
              <Link
                to="/collections"
                onClick={onClose}
                className="inline-block px-5 py-2 bg-primary text-primary-foreground text-[10px] font-display tracking-[0.15em] uppercase hover:bg-primary/90 transition-colors"
              >
                Browse All Sarees
              </Link>
            </div>
          )}
          {results.map(p => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors"
            >
              <div className="h-12 w-12 rounded bg-muted overflow-hidden shrink-0">
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-accent" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{p.name}</p>
                <p className="text-xs text-muted-foreground">{useCurrency().format(p.price)}</p>
              </div>
            </Link>
          ))}
        </div>

        {!query.trim() && (
          <p className="text-xs text-muted-foreground text-center py-6 font-body">
            Start typing to search by saree name, fabric or category
          </p>
        )}
      </div>
    </div>
  );
}
