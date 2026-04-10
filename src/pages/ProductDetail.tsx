import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { PageMeta } from '@/components/PageMeta';
import { ProductReviews } from '@/components/ProductReviews';
import { RecentlyViewed, addToRecentlyViewed } from '@/components/RecentlyViewed';
import { RelatedProducts } from '@/components/RelatedProducts';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import {
  ShoppingBag, Heart, Share2, Truck, Shield, RotateCcw,
  ChevronLeft, ChevronRight, ZoomIn, ArrowLeft, MessageCircle, X,
  Copy, Facebook, Twitter,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const colorNameMap: Record<string, string> = {
  '#c41e3a': 'RED', '#d4af37': 'GOLD', '#8b0000': 'MAROON',
  '#0047ab': 'BLUE', '#1a237e': 'NAVY', '#2e8b57': 'GREEN',
  '#006400': 'FOREST', '#ff00ff': 'MAGENTA', '#ffc0cb': 'PINK',
  '#c71585': 'ROSE', '#ff8c00': 'ORANGE', '#ff4500': 'VERMILION',
  '#fffdd0': 'CREAM', '#f5f5dc': 'BEIGE', '#800000': 'MAROON',
};

const getColorName = (hex: string) =>
  colorNameMap[hex.toLowerCase()] || hex.replace('#', '').toUpperCase().slice(0, 3);

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist, isLoggedIn } = useWishlist();
  const [selectedColor, setSelectedColor] = useState<number | null>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [showZoom, setShowZoom] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [showShareMenu, setShowShareMenu] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  const { data: product, isLoading } = useQuery({
    queryKey: ['storefront-product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('sku', id!)
        .eq('is_active', true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: variants } = useQuery({
    queryKey: ['storefront-variants', product?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', product!.id)
        .eq('is_active', true);
      if (error) throw error;
      return data;
    },
    enabled: !!product?.id,
  });

  // Track recently viewed — must be before any early returns
  useEffect(() => {
    if (product) {
      addToRecentlyViewed({
        id: product.id, name: product.name, sku: product.sku,
        image: product.images?.[0] || '/placeholder.svg', price: Number(product.price),
      });
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <AnnouncementBar />
        <Navbar />
        <div className="container py-6 md:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
            <Skeleton className="aspect-[3/4] w-full" />
            <div className="space-y-5">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-10 w-1/3" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <AnnouncementBar />
        <Navbar />
        <div className="container py-20 text-center">
          <h1 className="font-display text-3xl mb-4">Product Not Found</h1>
          <Link to="/collections" className="text-primary underline font-body">Back to Collections</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : ['/placeholder.svg'];
  const colors = product.colors || [];
  const hasVariants = variants && variants.length > 0;

  // Compute attribute options from variants
  const variantAttrKeys = hasVariants
    ? Array.from(new Set(variants.flatMap(v => Object.keys((v.attributes as Record<string, string>) || {}))))
    : [];
  const attrOptions: Record<string, string[]> = {};
  variantAttrKeys.forEach(key => {
    attrOptions[key] = Array.from(new Set(
      variants!.map(v => ((v.attributes as Record<string, string>) || {})[key]).filter(Boolean)
    ));
  });

  // Find selected variant
  const selectedVariant = hasVariants
    ? variants.find(v => {
        const attrs = (v.attributes as Record<string, string>) || {};
        return variantAttrKeys.every(k => attrs[k] === selectedAttributes[k]);
      })
    : null;

  const allAttributesSelected = hasVariants
    ? variantAttrKeys.every(k => selectedAttributes[k])
    : true;

  // Use variant price/stock if a variant is selected, otherwise base product
  const displayPrice = selectedVariant ? selectedVariant.price : product.price;
  const displayOriginalPrice = selectedVariant ? selectedVariant.original_price : product.original_price;
  const displayStock = selectedVariant ? selectedVariant.stock : (product.stock ?? 0);
  const isInStock = hasVariants ? (selectedVariant ? displayStock > 0 : false) : (product.stock ?? 0) > 0;
  const categoryName = (product as any).categories?.name || '';

  const prevImage = () => setCurrentImage(i => (i === 0 ? images.length - 1 : i - 1));
  const nextImage = () => setCurrentImage(i => (i === images.length - 1 ? 0 : i + 1));

  const productUrl = window.location.href;
  const shareText = `Check out ${product.name} at ₹${Number(displayPrice).toLocaleString()}`;

  const shareLinks = [
    { label: 'WhatsApp', icon: '💬', url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + productUrl)}` },
    { label: 'Facebook', icon: '📘', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}` },
    { label: 'X (Twitter)', icon: '𝕏', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(productUrl)}` },
    { label: 'Pinterest', icon: '📌', url: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(productUrl)}&media=${encodeURIComponent(images[0])}&description=${encodeURIComponent(shareText)}` },
    { label: 'Email', icon: '✉️', url: `mailto:?subject=${encodeURIComponent(product.name)}&body=${encodeURIComponent(shareText + '\n' + productUrl)}` },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      toast.success('Link copied to clipboard!');
    } catch {
      toast.error('Unable to copy link');
    }
    setShowShareMenu(false);
  };

  // Close share menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
        setShowShareMenu(false);
      }
    };
    if (showShareMenu) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showShareMenu]);

  const whatsappMessage = encodeURIComponent(
    `Hi, I'm interested in ${product.name} (SKU: ${selectedVariant?.sku || product.sku}) priced at ₹${Number(displayPrice).toLocaleString()}. Please share more details.`
  );

  const cartProduct = {
    id: selectedVariant?.sku || product.sku,
    name: product.name + (selectedVariant ? ` (${Object.values((selectedVariant.attributes as Record<string, string>) || {}).join(', ')})` : ''),
    price: Number(displayPrice),
    originalPrice: displayOriginalPrice ? Number(displayOriginalPrice) : undefined,
    image: images[0],
    category: categoryName,
    colors: colors,
    description: product.description || '',
  };

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || '',
    sku: product.sku,
    image: images[0],
    offers: {
      '@type': 'Offer',
      price: displayPrice,
      priceCurrency: 'INR',
      availability: isInStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `https://kaviwomensworld.lovable.app/product/${product.sku}`,
    },
  };

  return (
    <div className="min-h-screen">
      <PageMeta
        title={product.name}
        description={product.description || `Buy ${product.name} at ₹${product.price.toLocaleString()} — Free shipping across India.`}
        canonicalPath={`/product/${product.sku}`}
        ogImage={images[0]}
        ogType="product"
        jsonLd={productJsonLd}
      />
      <AnnouncementBar />
      <Navbar />
      <main className="container py-6 md:py-10">
        <Link
          to="/collections"
          className="inline-flex items-center gap-1.5 font-body text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Collections
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
          {/* Image carousel */}
          <div className="relative group">
            <div className="aspect-[3/4] overflow-hidden bg-muted relative">
              <img
                src={images[currentImage]}
                alt={product.name}
                className="w-full h-full object-cover"
                loading="lazy"
                width={800}
                height={1067}
              />
              <button
                onClick={() => setShowZoom(true)}
                className="absolute top-4 right-4 bg-background/80 backdrop-blur p-2 rounded-full shadow-sm hover:bg-background transition-colors"
                aria-label="Zoom image"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>

            {images.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur p-2.5 rounded-full shadow md:opacity-0 md:group-hover:opacity-100 transition-opacity" aria-label="Previous image">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur p-2.5 rounded-full shadow md:opacity-0 md:group-hover:opacity-100 transition-opacity" aria-label="Next image">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {images.length > 1 && (
              <div className="flex justify-center gap-2 mt-3">
                {images.map((_, i) => (
                  <button key={i} onClick={() => setCurrentImage(i)} className={`h-2 w-2 rounded-full transition-colors ${i === currentImage ? 'bg-primary' : 'bg-border'}`} aria-label={`Image ${i + 1}`} />
                ))}
              </div>
            )}
          </div>

          {/* Product details */}
          <div className="space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold leading-tight">{product.name}</h1>
                <p className="font-body text-xs text-muted-foreground mt-0.5">SKU: {product.sku}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (!isLoggedIn) { toast.error('Please login to use wishlist'); return; }
                    if (product) toggleWishlist(product.id);
                  }}
                  className={`p-2 border rounded-full transition-colors ${isWishlisted(product.id) ? 'border-primary text-primary bg-primary/10' : 'border-border hover:border-primary hover:text-primary'}`}
                  aria-label="Add to wishlist"
                >
                  <Heart className={`h-5 w-5 ${isWishlisted(product.id) ? 'fill-current' : ''}`} />
                </button>
                <div className="relative" ref={shareRef}>
                  <button
                    onClick={() => setShowShareMenu(prev => !prev)}
                    className="p-2 border border-border rounded-full hover:border-primary hover:text-primary transition-colors"
                    aria-label="Share product"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                  {showShareMenu && (
                    <div className="absolute right-0 top-12 z-50 bg-card border border-border rounded-lg shadow-lg py-2 w-52 animate-in fade-in slide-in-from-top-2 duration-200">
                      <p className="px-4 py-1.5 font-body text-xs text-muted-foreground font-semibold uppercase tracking-wider">Share via</p>
                      {shareLinks.map(link => (
                        <a
                          key={link.label}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setShowShareMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 font-body text-sm hover:bg-muted transition-colors"
                        >
                          <span className="text-base">{link.icon}</span>
                          {link.label}
                        </a>
                      ))}
                      <div className="border-t border-border my-1" />
                      <button
                        onClick={handleCopyLink}
                        className="flex items-center gap-3 px-4 py-2.5 font-body text-sm hover:bg-muted transition-colors w-full text-left"
                      >
                        <Copy className="h-4 w-4" />
                        Copy Link
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-display text-3xl font-bold">₹{Number(displayPrice).toLocaleString()}</span>
              {displayOriginalPrice && (
                <span className="font-body text-base text-muted-foreground line-through">₹{Number(displayOriginalPrice).toLocaleString()}</span>
              )}
              <span className={`text-xs font-body font-semibold px-3 py-1 rounded-full border ${isInStock ? 'text-emerald-700 border-emerald-300 bg-emerald-50' : 'text-red-700 border-red-300 bg-red-50'}`}>
                {hasVariants && !allAttributesSelected ? 'Select Options' : isInStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {displayOriginalPrice && (
              <span className="inline-block bg-primary/10 text-primary text-xs font-body font-bold px-3 py-1 rounded">
                {Math.round((1 - Number(displayPrice) / Number(displayOriginalPrice)) * 100)}% OFF
              </span>
            )}

            <div>
              <h3 className="font-display text-base font-semibold mb-1">Description</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {colors.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-body text-sm font-semibold">Color:</span>
                  <span className="font-body text-sm text-muted-foreground">
                    {selectedColor !== null ? getColorName(colors[selectedColor]) : 'Select a color'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color, i) => (
                    <button key={i} onClick={() => setSelectedColor(i)}
                      className={`px-3 py-1.5 rounded-full text-xs font-body font-medium border transition-all ${selectedColor === i ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-foreground/40'}`}>
                      {getColorName(color)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Variant attribute selectors */}
            {hasVariants && variantAttrKeys.map(key => (
              <div key={key}>
                <h3 className="font-body text-sm font-semibold mb-2">{key} <span className="text-primary">*</span></h3>
                <div className="flex flex-wrap gap-2">
                  {attrOptions[key]?.map(val => (
                    <button key={val} onClick={() => setSelectedAttributes(prev => ({ ...prev, [key]: val }))}
                      className={`px-4 py-1.5 rounded text-xs font-body font-medium border transition-all ${selectedAttributes[key] === val ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-foreground/40'}`}>
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Free Size fallback (only when no variants) */}
            {!hasVariants && (
              <div>
                <h3 className="font-body text-sm font-semibold mb-2">Size <span className="text-primary">*</span></h3>
                <div className="inline-block border border-primary rounded px-5 py-2 text-sm font-body font-medium text-foreground">Free Size</div>
              </div>
            )}

            <div className="space-y-3 pt-2">
              <button
                onClick={() => {
                  if (!isInStock) return;
                  if (colors.length > 0 && selectedColor === null) return;
                  if (hasVariants && !allAttributesSelected) return;
                  addToCart(cartProduct);
                }}
                disabled={!isInStock || (colors.length > 0 && selectedColor === null) || (hasVariants && !allAttributesSelected)}
                className={`w-full py-3.5 text-sm tracking-[0.15em] font-body flex items-center justify-center gap-2 transition-colors ${
                  !isInStock || (hasVariants && !allAttributesSelected)
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : colors.length > 0 && selectedColor === null
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-primary text-primary-foreground hover:bg-burgundy-light'
                }`}
              >
                <ShoppingBag className="h-4 w-4" />
                {hasVariants && !allAttributesSelected ? 'Please Select Options Above' : !isInStock ? 'OUT OF STOCK' : colors.length > 0 && selectedColor === null ? 'Please Select Options Above' : 'ADD TO CART'}
              </button>

              <a
                href={`https://wa.me/919494644998?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 text-sm tracking-[0.1em] font-body flex items-center justify-center gap-2 bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                Order on WhatsApp
              </a>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
              {[
                { icon: Truck, label: 'Free Shipping' },
                { icon: Shield, label: 'Secure Payment' },
                { icon: RotateCcw, label: 'Easy Returns' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="text-center">
                  <Icon className="h-5 w-5 mx-auto mb-1 text-gold" />
                  <p className="font-body text-[10px] text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <ProductReviews productId={product.id} />
        <RelatedProducts productId={product.id} currentSku={product.sku} />
        <RecentlyViewed currentSku={product.sku} />
      </main>

      {showZoom && (
        <div className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4" onClick={() => setShowZoom(false)}>
          <button className="absolute top-4 right-4 p-3 bg-background/20 rounded-full text-primary-foreground" onClick={() => setShowZoom(false)} aria-label="Close zoom">
            <X className="h-6 w-6" />
          </button>
          <img src={images[currentImage]} alt={product.name} className="max-w-full max-h-full object-contain" />
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductDetail;
