import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { PageMeta } from '@/components/PageMeta';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CollectionsSidebar } from '@/components/CollectionsSidebar';
import { ProductCardSkeleton } from '@/components/ProductCardSkeleton';
import { ArrowUp, Grid2x2, Grid3x3, LayoutList, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const filterTabs = [
  { name: 'All Collections', slug: 'all' },
  { name: 'New Arrivals', slug: 'new-arrivals' },
  { name: 'Best Sellers', slug: 'best-sellers' },
];

type SortOption = 'newest' | 'price-low' | 'price-high' | 'name-az';
type GridLayout = '2' | '3' | '4';
const PAGE_SIZE = 12;

const Collections = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeFilter = searchParams.get('filter') || 'all';
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [gridLayout, setGridLayout] = useState<GridLayout>('3');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { data: categories = [] } = useQuery({
    queryKey: ['storefront-categories-list'],
    queryFn: async () => {
      const { data: cats, error } = await supabase.from('categories').select('*').order('sort_order');
      if (error) throw error;
      const { data: productCounts } = await supabase
        .from('products')
        .select('category_id')
        .eq('is_active', true);
      const counts: Record<string, number> = {};
      productCounts?.forEach(p => {
        if (p.category_id) counts[p.category_id] = (counts[p.category_id] || 0) + 1;
      });
      return (cats || []).filter(c => (counts[c.id] || 0) > 0);
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
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    }
    if (selectedColors.length > 0) {
      result = result.filter(p =>
        p.colors?.some((c: string) => selectedColors.some(sc => c.toLowerCase().includes(sc.toLowerCase()) || sc.toLowerCase().includes(c.toLowerCase())))
      );
    }
    if (selectedMaterials.length > 0) {
      result = result.filter(p =>
        selectedMaterials.some(m => p.name.toLowerCase().includes(m.toLowerCase()) || (p.description?.toLowerCase().includes(m.toLowerCase())))
      );
    }
    switch (sortBy) {
      case 'price-low': result = [...result].sort((a, b) => a.price - b.price); break;
      case 'price-high': result = [...result].sort((a, b) => b.price - a.price); break;
      case 'name-az': result = [...result].sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return result;
  }, [products, sortBy, priceRange, selectedColors, selectedMaterials, searchQuery]);

  const paginatedProducts = filteredAndSorted.slice(0, page * PAGE_SIZE);
  const hasMore = page * PAGE_SIZE < filteredAndSorted.length;
  const activeLabel = allTabs.find(t => t.slug === activeFilter)?.name || 'Collections';
  const hasActiveFilters = priceRange[0] > 0 || priceRange[1] < 50000 || selectedColors.length > 0 || selectedMaterials.length > 0;

  const handleFilterChange = (slug: string) => {
    setPage(1);
    setSearchParams(slug === 'all' ? {} : { filter: slug });
  };

  const handleClearFilters = () => {
    setPriceRange([0, 50000]);
    setSelectedColors([]);
    setSelectedMaterials([]);
    setPage(1);
  };

  const sidebarProps = {
    allTabs,
    activeFilter,
    onFilterChange: handleFilterChange,
    priceRange,
    onPriceRangeChange: (r: [number, number]) => { setPriceRange(r); setPage(1); },
    selectedColors,
    onColorsChange: (c: string[]) => { setSelectedColors(c); setPage(1); },
    selectedMaterials,
    onMaterialsChange: (m: string[]) => { setSelectedMaterials(m); setPage(1); },
    hasActiveFilters,
    onClearFilters: handleClearFilters,
  };

  const gridCols = {
    '2': 'grid-cols-1 sm:grid-cols-2',
    '3': 'grid-cols-2 md:grid-cols-3',
    '4': 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  };

  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title={
          activeFilter === 'all'
            ? 'Shop All Sarees'
            : `${activeLabel} Sarees`
        }
        description={
          activeFilter === 'all'
            ? 'Browse the complete Manchala Gadwal Sarees collection — handwoven silk, cotton, and bridal sarees crafted by master weavers of Telangana.'
            : `Shop authentic ${activeLabel} sarees at Manchala Gadwal Sarees. Handwoven by master artisans with pure zari, premium fabrics, and free shipping across India.`
        }
        canonicalPath={activeFilter === 'all' ? '/collections' : `/collections?filter=${activeFilter}`}
        ogType="website"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: activeFilter === 'all' ? 'All Sarees' : `${activeLabel} Sarees`,
          description:
            activeFilter === 'all'
              ? 'Complete saree collection at Manchala Gadwal Sarees.'
              : `${activeLabel} saree collection at Manchala Gadwal Sarees.`,
          url: `https://manchalagadwalsarees.lovable.app/collections${activeFilter === 'all' ? '' : `?filter=${activeFilter}`}`,
          isPartOf: {
            '@type': 'WebSite',
            name: 'Manchala Gadwal Sarees',
            url: 'https://manchalagadwalsarees.lovable.app',
          },
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: filteredAndSorted.length,
            itemListElement: filteredAndSorted.slice(0, 10).map((p, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: p.name,
              url: `https://manchalagadwalsarees.lovable.app/product/${p.id}`,
            })),
          },
        }}
      />
      <AnnouncementBar />
      <Navbar /><Breadcrumbs />

      {/* ─── Ornate Heritage Banner ─── */}
      <section className="relative bg-foreground overflow-hidden">
        {/* Mandala pattern overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, hsl(36 72% 48% / 0.4) 0%, transparent 40%), 
                            radial-gradient(circle at 80% 30%, hsl(36 72% 48% / 0.3) 0%, transparent 40%),
                            radial-gradient(circle at 50% 80%, hsl(36 72% 48% / 0.2) 0%, transparent 40%)`
        }} />
        
        <div className="relative container py-16 md:py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-accent text-[10px] tracking-[0.4em] uppercase font-body block mb-3">
              ◆&nbsp;&nbsp;Curated With Love&nbsp;&nbsp;◆
            </span>
            <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4 tracking-wide">
              {activeLabel}
            </h1>
            <div className="w-24 ornate-line mx-auto mb-4" />
            <p className="font-serif text-primary-foreground/70 text-lg md:text-xl italic max-w-xl mx-auto">
              {isLoading ? 'Discovering treasures...' : `${filteredAndSorted.length} exquisite pieces await you`}
            </p>
          </motion.div>
        </div>

        {/* Bottom temple border */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />
      </section>

      {/* ─── Quick Filter Chips ─── */}
      <div className="border-b border-border bg-card/50">
        <div className="container">
          <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-hide">
            {allTabs.map(tab => (
              <button
                key={tab.slug}
                onClick={() => handleFilterChange(tab.slug)}
                className={cn(
                  'whitespace-nowrap px-5 py-2 text-xs font-display tracking-[0.1em] uppercase transition-all border',
                  activeFilter === tab.slug
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-transparent text-muted-foreground border-border hover:border-accent hover:text-accent'
                )}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <main className="container py-8 md:py-12">
        <div className="flex gap-6 lg:gap-10">
          <CollectionsSidebar {...sidebarProps} />

          <div className="flex-1 min-w-0">
            {/* ─── Toolbar ─── */}
            <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-border">
              <p className="text-sm font-body text-muted-foreground">
                Showing <span className="text-foreground font-semibold">{paginatedProducts.length}</span> of{' '}
                <span className="text-foreground font-semibold">{filteredAndSorted.length}</span> pieces
              </p>

              <div className="flex items-center gap-3">
                {/* Grid layout toggle — desktop only */}
                <div className="hidden md:flex items-center border border-border">
                  {[
                    { value: '2' as GridLayout, icon: Grid2x2 },
                    { value: '3' as GridLayout, icon: Grid3x3 },
                    { value: '4' as GridLayout, icon: LayoutList },
                  ].map(({ value, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setGridLayout(value)}
                      className={cn(
                        'p-2 transition-colors',
                        gridLayout === value
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  ))}
                </div>

                <Select value={sortBy} onValueChange={(v) => { setSortBy(v as SortOption); setPage(1); }}>
                  <SelectTrigger className="w-[180px] h-9 text-xs font-body border-border">
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
            </div>

            {/* ─── Product Grid ─── */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilter + sortBy}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className={cn('grid gap-5 md:gap-7', gridCols[gridLayout])}
              >
                {isLoading
                  ? Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
                  : paginatedProducts.map((product, i) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.4) }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
              </motion.div>
            </AnimatePresence>

            {/* ─── Load More ─── */}
            {hasMore && (
              <div className="flex justify-center mt-14">
                <button
                  onClick={() => setPage(p => p + 1)}
                  className="group relative px-10 py-4 border-2 border-accent text-accent text-xs tracking-[0.2em] font-display uppercase hover:bg-accent hover:text-accent-foreground transition-all duration-300"
                >
                  <span className="relative z-10">
                    Discover More ({filteredAndSorted.length - paginatedProducts.length} remaining)
                  </span>
                  {/* Decorative corners */}
                  <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary" />
                  <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary" />
                  <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary" />
                  <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary" />
                </button>
              </div>
            )}

            {/* ─── Empty State ─── */}
            {!isLoading && filteredAndSorted.length === 0 && (
              <div className="text-center py-24">
                <span className="text-accent text-4xl block mb-4">◆</span>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">No Treasures Found</h3>
                <p className="text-muted-foreground font-body max-w-md mx-auto">
                  We couldn't find any sarees matching your criteria. Try adjusting your filters to discover more pieces.
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="mt-6 px-6 py-2.5 bg-primary text-primary-foreground text-xs font-display tracking-[0.15em] uppercase hover:bg-primary/90 transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* ─── Back to Top ─── */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-50 h-12 w-12 bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors border border-accent/30"
            aria-label="Back to top"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Collections;
