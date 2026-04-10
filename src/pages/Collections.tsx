import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';

const filterTabs = [
  { name: 'All Collections', slug: 'all' },
  { name: 'New Arrivals', slug: 'new-arrivals' },
  { name: 'Best Sellers', slug: 'best-sellers' },
];

const Collections = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeFilter = searchParams.get('filter') || 'all';

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
        // Filter by category slug
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

  const activeLabel = allTabs.find(t => t.slug === activeFilter)?.name || 'Collections';

  return (
    <div className="min-h-screen">
      <AnnouncementBar />
      <Navbar />
      <main className="container py-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-center mb-2">
          {activeLabel}
        </h1>
        <p className="text-center text-muted-foreground font-body mb-8">
          {isLoading ? 'Loading...' : `${products.length} products`}
        </p>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {!isLoading && products.length === 0 && (
          <p className="text-center text-muted-foreground font-body py-20">
            No products found in this category yet.
          </p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Collections;
