import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart, CartProduct } from '@/context/CartContext';
import { useWishlist } from '@/hooks/useWishlist';
import { toast } from 'sonner';

export interface ProductData {
  id: string;
  sku: string;
  name: string;
  price: number;
  original_price?: number | null;
  images?: string[] | null;
  colors?: string[] | null;
  is_new?: boolean | null;
  is_best_seller?: boolean | null;
  is_active?: boolean | null;
  description?: string | null;
  category_id?: string | null;
  stock?: number | null;
}

interface ProductCardProps {
  product: ProductData;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist, isLoggedIn } = useWishlist();
  const image = product.images?.[0] || '/placeholder.svg';
  const liked = isWishlisted(product.id);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      toast.info('Please sign in to save items to your wishlist');
      return;
    }
    toggleWishlist(product.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const cartProduct: CartProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.original_price ?? undefined,
      image,
      category: '',
      colors: product.colors ?? [],
      description: product.description ?? '',
    };
    addToCart(cartProduct);
  };

  return (
    <div className="group relative">
      <Link to={`/product/${product.sku}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-muted rounded-sm">
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            width={800}
            height={1024}
          />
          {product.is_new && (
            <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-bold tracking-wider px-2.5 py-1 uppercase">
              New
            </span>
          )}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
            aria-label="Add to wishlist"
          >
            <Heart className={`h-4 w-4 ${liked ? 'fill-primary text-primary' : 'text-foreground/60'}`} />
          </button>

          {/* Quick Add — visible on hover (desktop) */}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-0 left-0 right-0 bg-primary text-primary-foreground text-xs font-body tracking-wider uppercase py-3 items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hover:bg-primary/90 hidden md:flex"
            aria-label="Quick add to cart"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Quick Add
          </button>
        </div>
        <div className="mt-3 space-y-1">
          <h3 className="font-display text-sm md:text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
          {product.colors && product.colors.length > 0 && (
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
          )}
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-2">
              <span className="font-body font-bold text-foreground text-sm">₹{product.price.toLocaleString()}</span>
              {product.original_price && (
                <span className="font-body text-xs text-muted-foreground line-through">
                  ₹{product.original_price.toLocaleString()}
                </span>
              )}
            </div>
            {/* Mobile add-to-cart button */}
            <button
              onClick={handleAddToCart}
              className="md:hidden p-2 bg-primary text-primary-foreground rounded-full shrink-0"
              aria-label="Add to cart"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
