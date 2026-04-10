import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '@/data/products';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="group relative">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-muted rounded-sm">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            width={800}
            height={1024}
          />
          {product.isNew && (
            <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-bold tracking-wider px-2.5 py-1 uppercase">
              New
            </span>
          )}
          <button
            onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
            className="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
            aria-label="Add to wishlist"
          >
            <Heart className={`h-4 w-4 ${liked ? 'fill-primary text-primary' : 'text-foreground/60'}`} />
          </button>
        </div>
        <div className="mt-3 space-y-1">
          <h3 className="font-display text-base md:text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-1.5">
            {product.colors.slice(0, 3).map((color, i) => (
              <span
                key={i}
                className="h-3 w-3 rounded-full border border-border"
                style={{ backgroundColor: color }}
              />
            ))}
            {product.colors.length > 3 && (
              <span className="text-xs text-muted-foreground">+{product.colors.length - 3}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-body font-bold text-foreground">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="font-body text-sm text-muted-foreground line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
