import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CollectionsSidebarDesktop, CollectionsSidebarMobile } from '@/components/CollectionsSidebar';

const filterTabs = [
  { name: 'All Collections', slug: 'all' },
  { name: 'New Arrivals', slug: 'new-arrivals' },
  { name: 'Best Sellers', slug: 'best-sellers' },
];

type SortOption = 'newest' | 'price-low' | 'price-high' | 'name-az';
const PAGE_SIZE = 12;

const Collections = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeFilter = searchParams.get('filter') || 'all';
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [page, setPage] = useState(1);

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
        if (cat) query = query.eq('category_id', cat.id);
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
      case 'price-low': result = [...result].sort((a, b) => a.price - b.price); break;
      case 'price-high': result = [...result].sort((a, b) => b.price - a.price); break;
      case 'name-az': result = [...result].sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return result;
  }, [products, sortBy, priceRange]);

  const paginatedProducts = filteredAndSorted.slice(0, page * PAGE_SIZE);
  const hasMore = page * PAGE_SIZE < filteredAndSorted.length;

  const activeLabel = allTabs.find(t => t.slug === activeFilter)?.name || 'Collections';
  const hasActiveFilters = priceRange[0] > 0 || priceRange[1] < 50000;

  const handleFilterChange = (slug: string) => {
    setPage(1);
    setSearchParams(slug === 'all' ? {} : { filter: slug });
  };

  const handleClearFilters = () => {
    setPriceRange([0, 50000]);
    setPage(1);
  };

  const sidebarProps = {
    allTabs,
    activeFilter,
    onFilterChange: handleFilterChange,
    priceRange,
    onPriceRangeChange: (r: [number, number]) => { setPriceRange(r); setPage(1); },
    hasActiveFilters,
    onClearFilters: handleClearFilters,
  };

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

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <CollectionsSidebarDesktop {...sidebarProps} />

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Top bar: mobile filter trigger + sort */}
            <div className="flex items-center justify-between gap-4 mb-6 border-b border-border pb-4">
              <CollectionsSidebarMobile {...sidebarProps} />
              <div className="hidden lg:block" /> {/* spacer on desktop */}

              <Select value={sortBy} onValueChange={(v) => { setSortBy(v as SortOption); setPage(1); }}>
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

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {paginatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => setPage(p => p + 1)}
                  className="px-8 py-3 border border-primary text-primary text-xs tracking-[0.15em] font-body uppercase hover:bg-primary hover:text-primary-foreground transition-colors rounded-sm"
                >
                  Load More ({filteredAndSorted.length - paginatedProducts.length} remaining)
                </button>
              </div>
            )}

            {!isLoading && filteredAndSorted.length === 0 && (
              <p className="text-center text-muted-foreground font-body py-20">
                No products found. Try adjusting your filters.
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Collections;
