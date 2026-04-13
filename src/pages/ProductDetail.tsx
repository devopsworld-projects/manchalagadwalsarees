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
import { WhatsAppIcon } from '@/components/WhatsAppIcon';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/context/CartContext';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import { toast } from 'sonner';
import {
  ShoppingBag, Heart, Share2, Truck, Shield, RotateCcw,
  ChevronLeft, ChevronRight, ZoomIn, ArrowLeft, X, Copy, Check,
  Facebook, Twitter, Mail,
} from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';

const colorNameMap: Record<string, string> = {
  '#c41e3a': 'RED', '#d4af37': 'GOLD', '#8b0000': 'MAROON',
  '#0047ab': 'BLUE', '#1a237e': 'NAVY', '#2e8b57': 'GREEN',
  '#006400': 'FOREST', '#ff00ff': 'MAGENTA', '#ffc0cb': 'PINK',
  '#c71585': 'ROSE', '#ff8c00': 'ORANGE', '#ff4500': 'VERMILION',
  '#fffdd0': 'CREAM', '#f5f5dc': 'BEIGE', '#800000': 'MAROON',
};

const getColorName = (hex: string) =>
  colorNameMap[hex.toLowerCase()] || hex.replace('#', '').toUpperCase().slice(0, 3);

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3.25" y="3.25" width="17.5" height="17.5" rx="5.25" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4.25" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" />
    </svg>
  );
}

function ImageMagnifier({ src, alt }: { src: string; alt: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLens, setShowLens] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const ZOOM = 2.5;

  const handleMove = useCallback((clientX: number, clientY: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    setLensPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden cursor-crosshair"
      onMouseEnter={() => setShowLens(true)}
      onMouseLeave={() => setShowLens(false)}
      onMouseMove={e => handleMove(e.clientX, e.clientY)}
    >
      <img src={src} alt={alt} className="w-full h-full object-cover" loading="lazy" width={800} height={1067} />
      {showLens && (
        <div
          className="absolute inset-0 pointer-events-none hidden md:block"
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: `${ZOOM * 100}%`,
            backgroundPosition: `${lensPos.x}% ${lensPos.y}%`,
            backgroundRepeat: 'no-repeat',
          }}
        />
      )}
    </div>
  );
}

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist, isLoggedIn } = useWishlist();
  const { data: settings } = useStoreSettings();
  const phone = settings?.whatsapp_number || '919494644998';
  const [selectedColor, setSelectedColor] = useState<number | null>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [showZoom, setShowZoom] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [showShareMenu, setShowShareMenu] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);
  const desktopShareMenuRef = useRef<HTMLDivElement>(null);
  const mobileShareMenuRef = useRef<HTMLDivElement>(null);

  const { data: product, isLoading } = useQuery({
    queryKey: ['storefront-product', id],
    queryFn: async () => {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id!);
      const query = supabase
        .from('products')
        .select('*, categories(name)')
        .eq('is_active', true);
      if (isUuid) {
        query.or(`sku.eq.${id},id.eq.${id}`);
      } else {
        query.eq('sku', id!);
      }
      const { data, error } = await query.maybeSingle();
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

  const selectedVariantId = variants?.find(v => {
    const attrs = (v.attributes as Record<string, string>) || {};
    const keys = Object.keys(attrs);
    return keys.every(k => attrs[k] === selectedAttributes[k]);
  })?.id;

  useEffect(() => { setCurrentImage(0); }, [selectedVariantId]);

  useEffect(() => {
    if (product) {
      addToRecentlyViewed({
        id: product.id, name: product.name, sku: product.sku,
        image: product.images?.[0] || '/placeholder.svg', price: Number(product.price),
      });
    }
  }, [product]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      const clickedTrigger = shareRef.current?.contains(target);
      const clickedDesktopMenu = desktopShareMenuRef.current?.contains(target);
      const clickedMobileMenu = mobileShareMenuRef.current?.contains(target);
      if (!clickedTrigger && !clickedDesktopMenu && !clickedMobileMenu) setShowShareMenu(false);
    };
    if (showShareMenu) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showShareMenu]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowShareMenu(false); };
    if (showShareMenu) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [showShareMenu]);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <AnnouncementBar /><Navbar />
        <div className="container py-4 md:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-14">
            <Skeleton className="aspect-[3/4] w-full" />
            <div className="space-y-4 pt-2">
              <Skeleton className="h-7 w-3/4" /><Skeleton className="h-5 w-1/4" /><Skeleton className="h-10 w-1/3" />
              <div className="space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-2/3" /></div>
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
        <AnnouncementBar /><Navbar />
        <div className="container py-20 text-center">
          <h1 className="font-display text-3xl mb-4 tracking-wide">Product Not Found</h1>
          <Link to="/collections" className="text-primary underline font-body">Back to Collections</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const baseImages = product.images && product.images.length > 0 ? product.images : ['/placeholder.svg'];
  const colors = product.colors || [];
  const hasVariants = variants && variants.length > 0;

  const variantAttrKeys = hasVariants
    ? Array.from(new Set(variants.flatMap(v => Object.keys((v.attributes as Record<string, string>) || {}))))
    : [];
  const attrOptions: Record<string, string[]> = {};
  variantAttrKeys.forEach(key => {
    attrOptions[key] = Array.from(new Set(
      variants!.map(v => ((v.attributes as Record<string, string>) || {})[key]).filter(Boolean)
    ));
  });

  const selectedVariant = hasVariants
    ? variants.find(v => {
        const attrs = (v.attributes as Record<string, string>) || {};
        return variantAttrKeys.every(k => attrs[k] === selectedAttributes[k]);
      })
    : null;

  const allAttributesSelected = hasVariants ? variantAttrKeys.every(k => selectedAttributes[k]) : true;

  const variantImages = selectedVariant?.images && (selectedVariant.images as string[]).length > 0
    ? (selectedVariant.images as string[])
    : null;
  const images = variantImages || baseImages;

  const displayPrice = selectedVariant ? selectedVariant.price : product.price;
  const displayOriginalPrice = selectedVariant ? selectedVariant.original_price : product.original_price;
  const displayStock = selectedVariant ? selectedVariant.stock : (product.stock ?? 0);
  const isInStock = hasVariants ? (selectedVariant ? displayStock > 0 : false) : (product.stock ?? 0) > 0;
  const categoryName = (product as any).categories?.name || '';

  const prevImage = () => setCurrentImage(i => (i === 0 ? images.length - 1 : i - 1));
  const nextImage = () => setCurrentImage(i => (i === images.length - 1 ? 0 : i + 1));

  const productUrl = window.location.href;
  const shareText = `Check out ${product.name} at ₹${Number(displayPrice).toLocaleString()}`;

  const handleInstagramShare = async () => {
    try { await navigator.clipboard.writeText(productUrl); toast.success('Link copied. Paste it in Instagram.'); } catch { toast.error('Copy the link manually.'); }
    window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
    setShowShareMenu(false);
  };

  const shareLinks: Array<{ label: string; icon: JSX.Element; url?: string; onClick?: () => void }> = [
    { label: 'WhatsApp', icon: <WhatsAppIcon className="h-5 w-5" />, url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + productUrl)}` },
    { label: 'Instagram', icon: <InstagramIcon className="h-5 w-5" />, onClick: handleInstagramShare },
    { label: 'Facebook', icon: <Facebook className="h-5 w-5" />, url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}` },
    { label: 'X', icon: <Twitter className="h-5 w-5" />, url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(productUrl)}` },
    { label: 'Email', icon: <Mail className="h-5 w-5" />, url: `mailto:?subject=${encodeURIComponent(product.name)}&body=${encodeURIComponent(shareText + '\n' + productUrl)}` },
  ];

  const handleCopyLink = async () => {
    try { await navigator.clipboard.writeText(productUrl); toast.success('Link copied!'); } catch { toast.error('Unable to copy'); }
    setShowShareMenu(false);
  };

  const renderShareAction = (link: (typeof shareLinks)[number], layout: 'desktop' | 'mobile') => {
    const cls = layout === 'desktop'
      ? 'flex flex-col items-center gap-2 bg-muted/50 px-2 py-3 text-center transition-colors hover:bg-muted'
      : 'flex flex-col items-center gap-2 bg-muted/50 px-3 py-3 text-center transition-colors hover:bg-muted';
    const content = (
      <>
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-background text-foreground shadow-sm">{link.icon}</span>
        <span className={`font-body leading-tight text-foreground ${layout === 'desktop' ? 'text-[11px]' : 'text-xs'}`}>{link.label}</span>
      </>
    );
    if (link.url) return <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" onClick={() => setShowShareMenu(false)} className={cls}>{content}</a>;
    return <button key={link.label} type="button" onClick={link.onClick} className={cls}>{content}</button>;
  };

  const whatsappEnquiry = encodeURIComponent(`Hi, I'm interested in ${product.name} (SKU: ${selectedVariant?.sku || product.sku}) priced at ₹${Number(displayPrice).toLocaleString()}. Please share more details.`);
  const whatsappConfirm = encodeURIComponent(`Hi, I'd like to confirm my order for ${product.name} (SKU: ${selectedVariant?.sku || product.sku}) at ₹${Number(displayPrice).toLocaleString()}.`);

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
    '@context': 'https://schema.org', '@type': 'Product',
    name: product.name, description: product.description || '', sku: product.sku, image: images[0],
    offers: {
      '@type': 'Offer', price: displayPrice, priceCurrency: 'INR',
      availability: isInStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `https://kaviwomensworld.lovable.app/product/${product.sku}`,
    },
  };

  const discountPercent = displayOriginalPrice ? Math.round((1 - Number(displayPrice) / Number(displayOriginalPrice)) * 100) : 0;
  const canAddToCart = isInStock && (colors.length === 0 || selectedColor !== null) && allAttributesSelected;

  const mobileShareSheet = showShareMenu && typeof document !== 'undefined'
    ? createPortal(
        <>
          <div className="md:hidden fixed inset-0 z-[70] bg-foreground/50 backdrop-blur-sm" onClick={() => setShowShareMenu(false)} />
          <div ref={mobileShareMenuRef} className="md:hidden fixed inset-x-0 bottom-0 z-[80] rounded-t-3xl border-t border-border bg-card px-5 pt-3 pb-3 shadow-2xl safe-bottom">
            <div className="flex justify-center pb-2"><div className="h-1 w-10 rounded-full bg-border" /></div>
            <div className="pb-3">
              <p className="font-display text-sm font-bold tracking-wider text-foreground">Share this product</p>
            </div>
            <div className="grid grid-cols-3 gap-3 pb-4">
              {shareLinks.map(link => renderShareAction(link, 'mobile'))}
              <button type="button" onClick={handleCopyLink} className="flex flex-col items-center gap-2 bg-muted/50 px-3 py-3 text-center transition-colors hover:bg-muted">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-background text-foreground shadow-sm"><Copy className="h-5 w-5" /></span>
                <span className="font-body text-xs leading-tight text-foreground">Copy Link</span>
              </button>
            </div>
            <button type="button" onClick={() => setShowShareMenu(false)} className="mb-2 w-full border border-border bg-background px-4 py-3 font-display text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Cancel
            </button>
          </div>
        </>,
        document.body,
      )
    : null;

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <PageMeta
        title={product.name}
        description={product.description || `Buy ${product.name} at ₹${product.price.toLocaleString()}`}
        canonicalPath={`/product/${product.sku}`} ogImage={images[0]} ogType="product" jsonLd={productJsonLd}
      />
      <AnnouncementBar /><Navbar />

      <main>
        {/* Breadcrumb */}
        <div className="container px-4 md:px-6 pt-4 md:pt-6">
          <Link to="/collections" className="inline-flex items-center gap-2 font-display text-[10px] tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors uppercase">
            <ArrowLeft className="h-3 w-3" /> Back to Collections
          </Link>
        </div>

        {/* Product layout */}
        <div className="container px-4 md:px-6 py-4 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
            {/* ── Image Gallery ── */}
            <div className="space-y-3">
              {/* Main image */}
              <div className="relative group">
                <div className="aspect-[3/4] overflow-hidden bg-muted relative max-h-[70vh] lg:max-h-none">
                  <ImageMagnifier src={images[currentImage]} alt={product.name} />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                    {product.is_new && (
                      <span className="bg-primary text-primary-foreground text-[9px] font-display font-bold tracking-[0.15em] px-3 py-1 uppercase">New</span>
                    )}
                    {discountPercent > 0 && (
                      <span className="bg-accent text-accent-foreground text-[9px] font-body font-bold px-2.5 py-1">{discountPercent}% OFF</span>
                    )}
                  </div>

                  <button
                    onClick={() => setShowZoom(true)}
                    className="absolute top-4 right-4 bg-background/70 backdrop-blur p-2.5 shadow-sm hover:bg-background transition-colors z-10"
                    aria-label="Zoom"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </button>

                  {/* Image counter */}
                  {images.length > 1 && (
                    <div className="absolute bottom-3 right-3 bg-foreground/60 text-background text-[10px] font-body px-2 py-0.5">
                      {currentImage + 1}/{images.length}
                    </div>
                  )}

                  {/* Temple corner accents */}
                  <div className="absolute top-2 left-2 w-6 h-6 border-t border-l border-accent/30" />
                  <div className="absolute bottom-2 right-2 w-6 h-6 border-b border-r border-accent/30" />
                </div>

                {images.length > 1 && (
                  <>
                    <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/70 backdrop-blur p-2 shadow md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10" aria-label="Previous">
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/70 backdrop-blur p-2 shadow md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10" aria-label="Next">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail grid below main image */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={`aspect-[3/4] overflow-hidden border-2 transition-all ${
                        i === currentImage ? 'border-accent' : 'border-transparent opacity-50 hover:opacity-100'
                      }`}
                      aria-label={`View image ${i + 1}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Product Details — right side ── */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:w-[440px] xl:w-[480px] shrink-0 space-y-5"
            >
              {/* Category & SKU top line */}
              <div className="flex items-center gap-3">
                {categoryName && (
                  <span className="font-body text-[10px] tracking-[0.2em] text-accent uppercase">{categoryName}</span>
                )}
                <span className="font-body text-[10px] text-muted-foreground">SKU: {product.sku}</span>
              </div>

              {/* Title */}
              <h1 className="font-display text-2xl md:text-3xl font-bold leading-tight tracking-wide">{product.name}</h1>

              {/* Ornate separator */}
              <div className="ornate-line w-24" />

              {/* Price block */}
              <div className="flex items-baseline gap-4">
                <span className="font-display text-3xl md:text-4xl font-bold">₹{Number(displayPrice).toLocaleString()}</span>
                {displayOriginalPrice && (
                  <span className="font-body text-base text-muted-foreground line-through">₹{Number(displayOriginalPrice).toLocaleString()}</span>
                )}
              </div>

              {/* Stock status */}
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-display font-bold tracking-[0.15em] px-3 py-1 border uppercase ${
                  hasVariants && !allAttributesSelected ? 'text-muted-foreground border-border' :
                  isInStock ? 'text-emerald-700 border-emerald-300 bg-emerald-50' : 'text-red-700 border-red-300 bg-red-50'
                }`}>
                  {hasVariants && !allAttributesSelected ? 'Select Options' : isInStock ? 'In Stock' : 'Out of Stock'}
                </span>
                {/* Actions */}
                <div className="flex gap-2 ml-auto">
                  <button
                    onClick={() => {
                      if (!isLoggedIn) { toast.error('Please login to use wishlist'); return; }
                      if (product) toggleWishlist(product.id);
                    }}
                    className={`p-2.5 border transition-colors ${isWishlisted(product.id) ? 'border-primary text-primary bg-primary/10' : 'border-border hover:border-primary hover:text-primary'}`}
                    aria-label="Wishlist"
                  >
                    <Heart className={`h-4 w-4 ${isWishlisted(product.id) ? 'fill-current' : ''}`} />
                  </button>
                  <div className="relative" ref={shareRef}>
                    <button
                      onClick={async () => {
                        if (navigator.share) {
                          try { await navigator.share({ title: product.name, text: shareText, url: productUrl }); return; } catch (e: any) { if (e?.name === 'AbortError') return; }
                        }
                        setShowShareMenu(prev => !prev);
                      }}
                      className="p-2.5 border border-border hover:border-primary hover:text-primary transition-colors"
                      aria-label="Share"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                    {showShareMenu && (
                      <div ref={desktopShareMenuRef} className="hidden md:block absolute right-0 top-12 z-50 w-64 border border-border bg-card p-3 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
                        <p className="px-1 pb-3 font-display text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground">Share via</p>
                        <div className="grid grid-cols-3 gap-2">
                          {shareLinks.map(link => renderShareAction(link, 'desktop'))}
                          <button type="button" onClick={handleCopyLink} className="flex flex-col items-center gap-2 bg-muted/50 px-2 py-3 text-center hover:bg-muted">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-background text-foreground shadow-sm"><Copy className="h-5 w-5" /></span>
                            <span className="font-body text-[11px] text-foreground">Copy Link</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <p className="font-serif text-sm text-muted-foreground leading-relaxed italic">{product.description}</p>
              )}

              <div className="ornate-line" />

              {/* Colors */}
              {colors.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-display text-[11px] font-bold tracking-[0.15em] uppercase">Color</span>
                    <span className="font-body text-xs text-muted-foreground">
                      {selectedColor !== null ? getColorName(colors[selectedColor]) : '— Select'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color, i) => (
                      <button key={i} onClick={() => setSelectedColor(i)}
                        className={`px-4 py-2 text-[11px] font-display font-bold tracking-[0.1em] border transition-all uppercase ${
                          selectedColor === i ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/50'
                        }`}>
                        {getColorName(color)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Variants */}
              {hasVariants && variantAttrKeys.map(key => (
                <div key={key}>
                  <h3 className="font-display text-[11px] font-bold tracking-[0.15em] uppercase mb-3">{key} <span className="text-accent">*</span></h3>
                  <div className="flex flex-wrap gap-2">
                    {attrOptions[key]?.map(val => (
                      <button key={val} onClick={() => setSelectedAttributes(prev => ({ ...prev, [key]: val }))}
                        className={`px-4 py-2 text-[11px] font-display tracking-[0.1em] border transition-all ${
                          selectedAttributes[key] === val ? 'border-primary bg-primary/10 text-primary font-bold' : 'border-border text-muted-foreground hover:border-primary/50'
                        }`}>
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {!hasVariants && (
                <div>
                  <h3 className="font-display text-[11px] font-bold tracking-[0.15em] uppercase mb-3">Size</h3>
                  <div className="inline-block border-2 border-primary px-6 py-2 text-[11px] font-display font-bold tracking-[0.15em] text-primary uppercase">Free Size</div>
                </div>
              )}

              {/* CTAs */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => { if (canAddToCart) addToCart(cartProduct); }}
                  disabled={!canAddToCart}
                  className={`w-full py-4 text-[11px] tracking-[0.25em] font-display font-bold flex items-center justify-center gap-3 transition-colors uppercase ${
                    canAddToCart ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag className="h-4 w-4" />
                  {hasVariants && !allAttributesSelected ? 'Select Options Above' : !isInStock ? 'Out of Stock' : colors.length > 0 && selectedColor === null ? 'Select Color Above' : 'Add to Cart'}
                </button>
                <a
                  href={`https://wa.me/${phone}?text=${whatsappEnquiry}`}
                  target="_blank" rel="noopener noreferrer"
                  className="w-full py-4 text-[11px] tracking-[0.2em] font-display font-bold flex items-center justify-center gap-3 bg-[#25D366] text-white hover:bg-[#1ebe57] transition-colors uppercase"
                >
                  <WhatsAppIcon className="h-4 w-4" /> Order on WhatsApp
                </a>
              </div>

              {/* WhatsApp confirmation */}
              <div className="bg-emerald-50 border border-emerald-200 p-4">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 bg-[#25D366] text-white p-1.5 mt-0.5"><Check className="h-3 w-3" /></div>
                  <div>
                    <p className="font-display text-[11px] font-bold tracking-wider text-emerald-900 uppercase">WhatsApp us before checkout!</p>
                    <p className="font-body text-[11px] text-emerald-700 mt-1 leading-relaxed">Confirm availability and get styling advice.</p>
                    <a href={`https://wa.me/${phone}?text=${whatsappConfirm}`} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-2 font-display text-[10px] font-bold text-[#25D366] tracking-wider hover:underline uppercase">
                      <WhatsAppIcon className="h-3 w-3" /> Chat to confirm
                    </a>
                  </div>
                </div>
              </div>

              {/* Trust badges — horizontal */}
              <div className="grid grid-cols-3 gap-2 pt-3">
                {[
                  { icon: Truck, label: 'Free Shipping', sub: 'Pan India' },
                  { icon: Shield, label: 'Secure Payment', sub: '100% Safe' },
                  { icon: RotateCcw, label: 'Easy Returns', sub: '7-day Policy' },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="text-center p-3 border border-border">
                    <Icon className="h-5 w-5 mx-auto mb-1.5 text-accent" />
                    <p className="font-display text-[9px] font-bold tracking-wider text-foreground uppercase">{label}</p>
                    <p className="font-body text-[9px] text-muted-foreground">{sub}</p>
                  </div>
                ))}
              </div>

              {/* Care Information */}
              <div className="border border-border overflow-hidden">
                <div className="bg-foreground px-5 py-3 flex items-center gap-2">
                  <span className="text-accent text-[7px]">◆</span>
                  <h3 className="font-display text-[11px] font-bold tracking-[0.2em] text-background uppercase">Care Information</h3>
                </div>
                <div className="px-5 py-4 space-y-3">
                  {[
                    { icon: '🧼', title: 'Dry Clean Only', desc: 'Professional dry cleaning recommended.' },
                    { icon: '👜', title: 'Proper Storage', desc: 'Store in cotton bag. Zari reacts to weather.' },
                    { icon: '🚫', title: 'Avoid Perfume', desc: 'Do not spray directly on the garment.' },
                    { icon: '🌬️', title: 'Air Regularly', desc: 'Air sarees every few months.' },
                  ].map(({ icon, title, desc }) => (
                    <div key={title} className="flex items-start gap-3">
                      <span className="text-sm mt-0.5 shrink-0">{icon}</span>
                      <div>
                        <p className="font-display text-[10px] font-bold tracking-wider text-foreground uppercase">{title}</p>
                        <p className="font-body text-[11px] text-muted-foreground leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Below-fold sections */}
        <div className="container px-4 md:px-6">
          <ProductReviews productId={product.id} />
          <RelatedProducts productId={product.id} currentSku={product.sku} />
          <RecentlyViewed currentSku={product.sku} />
        </div>
      </main>

      {mobileShareSheet}

      {/* Fullscreen zoom */}
      {showZoom && (
        <div className="fixed inset-0 z-[70] bg-foreground/95 flex items-center justify-center" onClick={() => setShowZoom(false)}>
          <button className="absolute top-4 right-4 p-3 bg-background/20 text-white hover:bg-background/40 z-10" onClick={() => setShowZoom(false)} aria-label="Close"><X className="h-6 w-6" /></button>
          {images.length > 1 && (
            <>
              <button onClick={e => { e.stopPropagation(); prevImage(); }} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-background/20 text-white hover:bg-background/40 z-10"><ChevronLeft className="h-6 w-6" /></button>
              <button onClick={e => { e.stopPropagation(); nextImage(); }} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-background/20 text-white hover:bg-background/40 z-10"><ChevronRight className="h-6 w-6" /></button>
            </>
          )}
          <img src={images[currentImage]} alt={product.name} className="max-w-[90vw] max-h-[85vh] object-contain" onClick={e => e.stopPropagation()} />
          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-background/20 backdrop-blur-sm p-2">
              {images.map((img, i) => (
                <button key={i} onClick={e => { e.stopPropagation(); setCurrentImage(i); }}
                  className={`w-10 h-12 overflow-hidden border-2 ${i === currentImage ? 'border-white' : 'border-transparent opacity-50 hover:opacity-80'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <Footer />
    </div>
  );
}

export default ProductDetail;
