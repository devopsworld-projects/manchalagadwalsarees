import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { SlidersHorizontal, X } from 'lucide-react';

const filterTabs = [
  { name: 'All Collections', slug: 'all' },
  { name: 'New Arrivals', slug: 'new-arrivals' },
  { name: 'Best Sellers', slug: 'best-sellers' },
];

type SortOption = 'newest' | 'price-low' | 'price-high' | 'name-az';

const Collections = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeFilter = searchParams.get('filter') || 'all';
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [showFilters, setShowFilters] = useState(false);

  const { data: categories = [] } = useQuery({
    queryKey: ['storefront-categories-list'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*').order('sort_order');
      if (error) throw error;
      return data;
    },
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['storefront-products', activeFilter],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*, categories(name, slug)')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (activeFilter === 'new-arrivals') {
        query = query.eq('is_new', true);
      } else if (activeFilter === 'best-sellers') {
        query = query.eq('is_best_seller', true);
      } else if (activeFilter !== 'all') {
        const cat = categories.find(c => c.slug === activeFilter);
        if (cat) {
          query = query.eq('category_id', cat.id);
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: activeFilter === 'all' || activeFilter === 'new-arrivals' || activeFilter === 'best-sellers' || categories.length > 0,
  });

  const allTabs = useMemo(() => {
    const catTabs = categories.map(c => ({ name: c.name, slug: c.slug }));
    return [...filterTabs, ...catTabs];
  }, [categories]);

  const filteredAndSorted = useMemo(() => {
    let result = products.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sortBy) {
      case 'price-low':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'name-az':
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
    return result;
  }, [products, sortBy, priceRange]);

  const activeLabel = allTabs.find(t => t.slug === activeFilter)?.name || 'Collections';
  const hasActiveFilters = priceRange[0] > 0 || priceRange[1] < 50000;

  return (
    <div className="min-h-screen">
      <AnnouncementBar />
      <Navbar />
      <main className="container py-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-center mb-2">
          {activeLabel}
        </h1>
        <p className="text-center text-muted-foreground font-body mb-8">
          {isLoading ? 'Loading...' : `${filteredAndSorted.length} products`}
        </p>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {allTabs.map(tab => (
            <button
              key={tab.slug}
              onClick={() => setSearchParams(tab.slug === 'all' ? {} : { filter: tab.slug })}
              className={`px-4 py-2 text-xs tracking-[0.1em] font-body transition-colors rounded-sm ${
                activeFilter === tab.slug
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-primary/10'
              }`}
            >
              {tab.name.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Sort + Filter bar */}
        <div className="flex items-center justify-between gap-4 mb-6 border-b border-border pb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm font-body text-foreground hover:text-primary transition-colors"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="h-2 w-2 rounded-full bg-primary" />
            )}
          </button>

          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="w-[180px] h-9 text-xs font-body">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="name-az">Name: A to Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Expandable filter panel */}
        {showFilters && (
          <div className="bg-muted/50 rounded-lg p-5 mb-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-sm font-semibold">Price Range</h3>
              {hasActiveFilters && (
                <button
                  onClick={() => setPriceRange([0, 50000])}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <X className="h-3 w-3" /> Clear
                </button>
              )}
            </div>
            <Slider
              value={priceRange}
              onValueChange={(v) => setPriceRange(v as [number, number])}
              min={0}
              max={50000}
              step={500}
              className="mb-3"
            />
            <div className="flex justify-between text-xs font-body text-muted-foreground">
              <span>₹{priceRange[0].toLocaleString('en-IN')}</span>
              <span>₹{priceRange[1].toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredAndSorted.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {!isLoading && filteredAndSorted.length === 0 && (
          <p className="text-center text-muted-foreground font-body py-20">
            No products found. Try adjusting your filters.
          </p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Collections;
