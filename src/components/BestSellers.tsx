import { products } from '@/data/products';
import { ProductCard } from './ProductCard';
import { Link } from 'react-router-dom';

export function BestSellers() {
  const bestSellers = products.filter(p => p.isBestSeller);

  return (
    <section className="py-16 md:py-24 bg-secondary/50">
      <div className="container">
        <div className="text-center mb-10">
          <span className="inline-block text-xs tracking-[0.2em] font-body text-muted-foreground border border-border px-4 py-1.5 mb-4 uppercase">
            Most Loved
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Best Sellers
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {bestSellers.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/collections?filter=best-sellers"
            className="inline-block border-2 border-primary text-primary px-10 py-3 text-sm tracking-[0.15em] font-body hover:bg-primary hover:text-primary-foreground transition-all"
          >
            View All
          </Link>
        </div>
      </div>
    </section>
  );
}
