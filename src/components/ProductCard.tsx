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
  const outOfStock = product.stock !== null && product.stock !== undefined && product.stock <= 0;

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

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
    if (outOfStock) {
      toast.error('This product is currently out of stock');
      return;
    }
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
        {/* Image container with temple-inspired frame */}
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
            loading="lazy"
            width={800}
            height={1024}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.is_new && !outOfStock && (
              <span className="bg-primary text-primary-foreground text-[9px] font-display font-bold tracking-[0.15em] px-3 py-1 uppercase">
                New
              </span>
            )}
            {outOfStock && (
              <span className="bg-foreground/80 text-background text-[9px] font-display font-bold tracking-[0.15em] px-3 py-1 uppercase">
                Sold Out
              </span>
            )}
            {discount > 0 && !outOfStock && (
              <span className="bg-accent text-accent-foreground text-[9px] font-body font-bold px-2 py-0.5">
                -{discount}%
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-3 right-3 p-2 bg-background/70 backdrop-blur-sm hover:bg-background transition-colors"
            aria-label="Add to wishlist"
          >
            <Heart className={`h-4 w-4 ${liked ? 'fill-primary text-primary' : 'text-foreground/50'}`} />
          </button>

          {/* Quick Add — desktop hover */}
          {!outOfStock && (
            <button
              onClick={handleAddToCart}
              className="absolute bottom-0 left-0 right-0 bg-primary text-primary-foreground text-[11px] font-display tracking-[0.2em] uppercase py-3.5 items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hover:bg-primary/90 hidden md:flex"
              aria-label="Quick add to cart"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Add to Cart
            </button>
          )}

          {/* Bottom gold accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Product info */}
        <div className="mt-3 space-y-1.5">
          <h3 className="font-display text-xs md:text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1 tracking-wide uppercase">
            {product.name}
          </h3>
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5">
              {product.colors.slice(0, 4).map((color, i) => (
                <span
                  key={i}
                  className="h-3 w-3 rounded-full border border-border/60"
                  style={{ backgroundColor: color }}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-[10px] text-muted-foreground font-body">+{product.colors.length - 4}</span>
              )}
            </div>
          )}
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-foreground text-sm tracking-wide">₹{product.price.toLocaleString()}</span>
              {product.original_price && (
                <span className="font-body text-[11px] text-muted-foreground line-through">
                  ₹{product.original_price.toLocaleString()}
                </span>
              )}
            </div>
            {/* Mobile add-to-cart */}
            {!outOfStock && (
              <button
                onClick={handleAddToCart}
                className="md:hidden p-2 bg-primary text-primary-foreground shrink-0"
                aria-label="Add to cart"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
