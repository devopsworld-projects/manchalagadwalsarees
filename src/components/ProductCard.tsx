import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart, CartProduct } from '@/context/CartContext';
import { useWishlist } from '@/hooks/useWishlist';
import { useCurrency } from '@/context/CurrencyContext';
import { toast } from 'sonner';
import { Motif } from '@/components/Motif';

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
  const { format } = useCurrency();
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
        {/* Image — premium boutique frame */}
        <div className="relative aspect-[3/4] overflow-hidden bg-secondary image-luxe">
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
            width={800}
            height={1024}
          />

          {/* Soft vignette on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          {/* Editorial inner frame */}
          <div className="pointer-events-none absolute inset-2 border border-background/0 group-hover:border-background/30 transition-colors duration-700" />

          {/* Subtle corner motif — fades in on hover */}
          <Motif
            kind="paisley"
            tint="cream"
            opacity={50}
            motion="hover-lift"
            className="absolute bottom-3 left-3 h-8 w-6 opacity-0 group-hover:opacity-60 transition-opacity duration-700"
          />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-1.5">
            {product.is_new && !outOfStock && (
              <span className="bg-background/95 backdrop-blur-sm text-primary text-[9px] font-display font-semibold tracking-luxe px-3 py-1.5 uppercase shadow-soft">
                New
              </span>
            )}
            {outOfStock && (
              <span className="bg-foreground/85 text-background text-[9px] font-display font-semibold tracking-luxe px-3 py-1.5 uppercase">
                Sold Out
              </span>
            )}
            {discount > 0 && !outOfStock && (
              <span className="bg-primary text-primary-foreground text-[9px] font-display font-semibold tracking-refined px-3 py-1.5 uppercase">
                -{discount}%
              </span>
            )}
          </div>

          {/* Wishlist — refined circular */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-4 right-4 h-9 w-9 rounded-full bg-background/95 backdrop-blur-sm flex items-center justify-center shadow-soft hover:shadow-elegant transition-all duration-500 hover:scale-110"
            aria-label="Add to wishlist"
          >
            <Heart className={`h-[15px] w-[15px] transition-colors ${liked ? 'fill-primary text-primary' : 'text-foreground/60'}`} />
          </button>

          {/* Quick Add — slides up on desktop hover */}
          {!outOfStock && (
            <button
              onClick={handleAddToCart}
              className="absolute bottom-3 left-3 right-3 bg-background/95 backdrop-blur-md text-primary text-[10px] font-display tracking-refined uppercase py-3.5 items-center justify-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out hover:bg-primary hover:text-primary-foreground hidden md:flex shadow-elegant"
              aria-label="Quick add to cart"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Add to Bag
            </button>
          )}
        </div>

        {/* Product info — editorial spacing */}
        <div className="mt-5 space-y-2.5 px-0.5">
          <h3 className="font-display text-[12px] md:text-[13px] font-medium text-foreground/90 group-hover:text-primary transition-colors duration-500 line-clamp-2 tracking-refined uppercase leading-relaxed">
            {product.name}
          </h3>

          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5">
              {product.colors.slice(0, 4).map((color, i) => (
                <span
                  key={i}
                  className="h-2.5 w-2.5 rounded-full border border-border/80 shadow-soft"
                  style={{ backgroundColor: color }}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-[10px] text-muted-foreground font-body ml-0.5">+{product.colors.length - 4}</span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between gap-2 pt-0.5">
            <div className="flex items-baseline gap-2">
              <span className="font-display font-semibold text-foreground text-[15px] tracking-wide">
                {format(product.price)}
              </span>
              {product.original_price && (
                <span className="font-body text-[11px] text-muted-foreground line-through">
                  {format(product.original_price)}
                </span>
              )}
            </div>
            {!outOfStock && (
              <button
                onClick={handleAddToCart}
                className="md:hidden h-9 w-9 rounded-full bg-primary text-primary-foreground shrink-0 flex items-center justify-center hover:bg-primary/90 transition-colors shadow-soft"
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
