import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { products, categories } from '@/data/products';

const Collections = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeFilter = searchParams.get('filter') || 'all';

  const filtered = useMemo(() => {
    switch (activeFilter) {
      case 'new-arrivals': return products.filter(p => p.isNew);
      case 'best-sellers': return products.filter(p => p.isBestSeller);
      case 'pattu-sarees': return products.filter(p => p.category === 'Pattu Sarees');
      case 'banarasi': return products.filter(p => p.category === 'Banarasi');
      case 'premium': return products.filter(p => p.category === 'Premium');
      default: return products;
    }
  }, [activeFilter]);

  return (
    <div className="min-h-screen">
      <AnnouncementBar />
      <Navbar />
      <main className="container py-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-center mb-2">
          {activeFilter === 'all' ? 'All Collections' : categories.find(c => c.slug === activeFilter)?.name || 'Collections'}
        </h1>
        <p className="text-center text-muted-foreground font-body mb-8">
          {filtered.length} products
        </p>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat.slug}
              onClick={() => setSearchParams(cat.slug === 'all' ? {} : { filter: cat.slug })}
              className={`px-4 py-2 text-xs tracking-[0.1em] font-body transition-colors rounded-sm ${
                activeFilter === cat.slug
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-primary/10'
              }`}
            >
              {cat.name.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Collections;
