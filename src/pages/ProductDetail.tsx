import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Footer } from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { PageMeta } from '@/components/PageMeta';
import { ProductReviews } from '@/components/ProductReviews';
import { RecentlyViewed, addToRecentlyViewed } from '@/components/RecentlyViewed';
import { RelatedProducts } from '@/components/RelatedProducts';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import { toast } from 'sonner';
import { ensureProductOgImage } from '@/lib/ogImage';
import {
  ShoppingBag, Heart, Share2, Truck, Shield, RotateCcw,
  ChevronLeft, ChevronRight, ZoomIn, ArrowLeft, X, Copy, Check,
  Facebook, Twitter, Mail, Zap, Plus, Minus, Loader2, AlertCircle, Clock, CalendarCheck, Sparkles,
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

function CollapsibleSection({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-border/60 pt-4">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full text-left group min-h-[44px]"
        aria-expanded={open}
      >
        <span className="font-display text-sm font-bold text-primary tracking-wide uppercase">{title}</span>
        {open ? <Minus className="h-4 w-4 text-primary" /> : <Plus className="h-4 w-4 text-primary" />}
      </button>
      {open && <div className="pt-4">{children}</div>}
    </div>
  );
}

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { format: formatPrice } = useCurrency();
  const { isWishlisted, toggleWishlist, isLoggedIn } = useWishlist();
  const { data: settings } = useStoreSettings();
  const phone = settings?.whatsapp_number || '919885879188';
  const [currentImage, setCurrentImage] = useState(0);
  const [showZoom, setShowZoom] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [showShareMenu, setShowShareMenu] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);
  const [ogImageUrl, setOgImageUrl] = useState<string | null>(null);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<null | { ok: boolean; eta: string; cod: boolean; city?: string; message: string }>(null);
  const [pincodeChecking, setPincodeChecking] = useState(false);
  const [specsExpanded, setSpecsExpanded] = useState(false);
  const [careOpen, setCareOpen] = useState(false);
  const [lightboxScale, setLightboxScale] = useState(1);
  const [lightboxOffset, setLightboxOffset] = useState({ x: 0, y: 0 });
  const thumbsContainerRef = useRef<HTMLDivElement>(null);
  const desktopShareMenuRef = useRef<HTMLDivElement>(null);
  const mobileShareMenuRef = useRef<HTMLDivElement>(null);

  // Care Information: persist open state per product; default open on first view
  useEffect(() => {
    if (!id) return;
    const key = `care-open:${id}`;
    const stored = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    if (stored === null) {
      setCareOpen(true); // first view default open
      try { localStorage.setItem(key, '1'); } catch {}
    } else {
      setCareOpen(stored === '1');
    }
  }, [id]);
  const handleCareToggle = (open: boolean) => {
    setCareOpen(open);
    if (id) { try { localStorage.setItem(`care-open:${id}`, open ? '1' : '0'); } catch {} }
  };

  // Reset lightbox zoom when image changes or closes
  useEffect(() => { setLightboxScale(1); setLightboxOffset({ x: 0, y: 0 }); }, [currentImage, showZoom]);

  // Lightbox keyboard controls
  useEffect(() => {
    if (!showZoom) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowZoom(false);
      else if (e.key === 'ArrowLeft') setCurrentImage(i => (i === 0 ? images.length - 1 : i - 1));
      else if (e.key === 'ArrowRight') setCurrentImage(i => (i === images.length - 1 ? 0 : i + 1));
      else if (e.key === '+' || e.key === '=') setLightboxScale(s => Math.min(4, s + 0.5));
      else if (e.key === '-') setLightboxScale(s => Math.max(1, s - 0.5));
      else if (e.key === '0') { setLightboxScale(1); setLightboxOffset({ x: 0, y: 0 }); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showZoom]);

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

  // Generate per-product Open Graph card (cached in storage by SKU)
  useEffect(() => {
    let cancelled = false;
    if (!product) return;
    const firstImage = product.images?.[0];
    if (!firstImage) return;
    const cat = (product as any).categories?.name || '';
    const priceLabel = `₹${Number(product.price).toLocaleString('en-IN')}`;
    ensureProductOgImage({
      sku: product.sku,
      name: product.name,
      category: cat,
      priceLabel,
      imageUrl: firstImage,
    }).then(url => {
      if (!cancelled && url) setOgImageUrl(url);
    });
    return () => { cancelled = true; };
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
  const shareText = `Check out ${product.name} at ${formatPrice(Number(displayPrice))}`;

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

  const whatsappEnquiry = encodeURIComponent(`Hi, I'm interested in ${product.name} (SKU: ${selectedVariant?.sku || product.sku}) priced at ${formatPrice(Number(displayPrice))}. Please share more details.`);
  const whatsappConfirm = encodeURIComponent(`Hi, I'd like to confirm my order for ${product.name} (SKU: ${selectedVariant?.sku || product.sku}) at ${formatPrice(Number(displayPrice))}.`);

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
      url: `https://manchalagadwalsarees.lovable.app/product/${product.sku}`,
    },
  };

  const discountPercent = displayOriginalPrice ? Math.round((1 - Number(displayPrice) / Number(displayOriginalPrice)) * 100) : 0;
  const canAddToCart = isInStock && allAttributesSelected;

  // Build "Specific Information" entries — saree-specific fields from product.specifications
  const productSpecs = ((product as any).specifications || {}) as Record<string, string>;
  const STRUCTURED_FIELDS = [
    'Pattern', 'Occasion', 'Fabric', 'Material',
    'Saree Length', 'Blouse Piece', 'Border Type', 'Border Size',
    'Color Family', 'Base Color', 'Secondary Color', 'Wash Care',
  ] as const;
  const structuredEntries: [string, string][] = STRUCTURED_FIELDS
    .map(k => [k, productSpecs[k]] as [string, string])
    .filter(([, v]) => !!v && String(v).trim() !== '');
  if (colors.length > 0) {
    structuredEntries.push(['Colors', colors.map(c => getColorName(c)).join(', ')]);
  }
  if (categoryName) structuredEntries.push(['Category', categoryName]);

  // Highlights — short curated chips from description + top specs
  const descSentence = (product.description || '').split(/(?<=[.!?])\s+/).find(s => s.trim().length > 20)?.trim();
  const highlights: { icon: string; title: string; text: string }[] = [];
  if (productSpecs['Fabric'] || productSpecs['Material']) {
    highlights.push({ icon: '🧵', title: 'Fabric & Material', text: [productSpecs['Material'], productSpecs['Fabric']].filter(Boolean).join(' · ') });
  }
  if (productSpecs['Pattern']) highlights.push({ icon: '✨', title: 'Pattern', text: productSpecs['Pattern'] });
  if (productSpecs['Occasion']) highlights.push({ icon: '🎉', title: 'Occasion', text: productSpecs['Occasion'] });
  if (productSpecs['Border Type']) highlights.push({ icon: '🪡', title: 'Border', text: [productSpecs['Border Type'], productSpecs['Border Size']].filter(Boolean).join(' · ') });
  if (productSpecs['Saree Length'] || productSpecs['Blouse Piece']) {
    highlights.push({ icon: '📏', title: 'Length', text: [productSpecs['Saree Length'], productSpecs['Blouse Piece']].filter(Boolean).join(' + ') });
  }
  if (descSentence) highlights.push({ icon: '💎', title: 'Crafted with care', text: descSentence.length > 90 ? descSentence.slice(0, 87) + '…' : descSentence });

  // Shipping cutoff (2 PM IST). If now is before cutoff, ships today; else next business day.
  const cutoffInfo = (() => {
    const now = new Date();
    // IST = UTC+5:30
    const istNow = new Date(now.getTime() + (now.getTimezoneOffset() + 330) * 60000);
    const cutoff = new Date(istNow);
    cutoff.setHours(14, 0, 0, 0);
    const beforeCutoff = istNow < cutoff;
    const dispatchDate = new Date(istNow);
    if (!beforeCutoff) dispatchDate.setDate(dispatchDate.getDate() + 1);
    // Skip Sunday
    if (dispatchDate.getDay() === 0) dispatchDate.setDate(dispatchDate.getDate() + 1);
    const msToCutoff = cutoff.getTime() - istNow.getTime();
    const hoursLeft = Math.max(0, Math.floor(msToCutoff / 3600000));
    const minsLeft = Math.max(0, Math.floor((msToCutoff % 3600000) / 60000));
    return { beforeCutoff, dispatchDate, hoursLeft, minsLeft };
  })();
  const fmtDate = (d: Date) => d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

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
    <div className="min-h-screen pb-32 md:pb-0">
      <PageMeta
        title={`${product.name}${categoryName ? ` | ${categoryName}` : ''} – ${formatPrice(Number(displayPrice))}`}
        description={
          (product.description ? product.description.replace(/\s+/g, ' ').slice(0, 140) + '… ' : '') +
          `Shop ${product.name}${categoryName ? ` from our ${categoryName} collection` : ''} at ${formatPrice(Number(displayPrice))}. Free shipping across India.`
        }
        canonicalPath={`/product/${product.sku}`} ogImage={ogImageUrl || images[0]} ogType="product" jsonLd={productJsonLd}
      />
      <AnnouncementBar /><Navbar />
      <Breadcrumbs
        items={[
          { label: 'Collections', to: '/collections' },
          ...(categoryName
            ? [{ label: categoryName, to: `/collections?category=${encodeURIComponent(categoryName)}` }]
            : []),
          { label: product.name },
        ]}
      />

      <main>
        {/* Back link */}
        <div className="container px-4 md:px-6 pt-4 md:pt-6">
          <Link to="/collections" className="inline-flex items-center gap-2 font-display text-[10px] tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors uppercase">
            <ArrowLeft className="h-3 w-3" /> Back to Collections
          </Link>
        </div>

        {/* Product layout — premium boutique: vertical thumbs + sticky details */}
        <div className="container px-4 md:px-6 py-4 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] gap-6 lg:gap-12 items-start">
            {/* ── Image Gallery: vertical thumbs + large main ── */}
            <div className="lg:sticky lg:top-24">
              <div className="flex gap-3">
                {/* Vertical thumbnail strip — desktop only */}
                <div
                  ref={thumbsContainerRef}
                  role="listbox"
                  aria-label="Product image thumbnails"
                  aria-orientation="vertical"
                  className="hidden lg:flex flex-col gap-2 w-20 shrink-0 max-h-[calc(100vh-8rem)] overflow-y-auto pr-1 [scrollbar-width:thin]"
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown') { e.preventDefault(); setCurrentImage(i => (i === images.length - 1 ? 0 : i + 1)); }
                    else if (e.key === 'ArrowUp') { e.preventDefault(); setCurrentImage(i => (i === 0 ? images.length - 1 : i - 1)); }
                    else if (e.key === 'Home') { e.preventDefault(); setCurrentImage(0); }
                    else if (e.key === 'End') { e.preventDefault(); setCurrentImage(images.length - 1); }
                    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowZoom(true); }
                  }}
                >
                  {images.map((src, i) => (
                    <button
                      key={i}
                      type="button"
                      role="option"
                      aria-selected={i === currentImage}
                      tabIndex={i === currentImage ? 0 : -1}
                      onClick={() => setCurrentImage(i)}
                      onMouseEnter={() => setCurrentImage(i)}
                      onFocus={() => setCurrentImage(i)}
                      className={`relative aspect-[3/4] overflow-hidden bg-muted transition-all border-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                        i === currentImage ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                      aria-label={`View image ${i + 1} of ${images.length}`}
                    >
                      <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>

                {/* Main image */}
                <div className="relative flex-1 group bg-muted overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setShowZoom(true)}
                    className="block w-full aspect-[3/4]"
                    aria-label="Zoom image"
                  >
                    <img
                      src={images[currentImage] || '/placeholder.svg'}
                      alt={`${product.name} — view ${currentImage + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      loading="eager"
                      width={900}
                      height={1200}
                    />
                  </button>

                  <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10 pointer-events-none">
                    {product.is_new && (
                      <span className="bg-primary text-primary-foreground text-[9px] font-display font-bold tracking-[0.18em] px-3 py-1 uppercase">New</span>
                    )}
                    {discountPercent > 0 && (
                      <span className="bg-accent text-accent-foreground text-[9px] font-body font-bold px-2.5 py-1">{discountPercent}% OFF</span>
                    )}
                  </div>

                  <span className="absolute top-4 right-4 bg-background/85 backdrop-blur p-2 rounded-full shadow-sm z-10 pointer-events-none">
                    <ZoomIn className="h-3.5 w-3.5" />
                  </span>

                  {images.length > 1 && (
                    <span className="absolute bottom-4 right-4 bg-foreground/70 text-background font-body text-[10px] tracking-wider px-2.5 py-1 backdrop-blur z-10">
                      {currentImage + 1} / {images.length}
                    </span>
                  )}

                  {images.length > 1 && (
                    <>
                      <button type="button" onClick={prevImage}
                        className="lg:hidden absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur p-2 rounded-full z-10"
                        aria-label="Previous image"><ChevronLeft className="h-4 w-4" /></button>
                      <button type="button" onClick={nextImage}
                        className="lg:hidden absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur p-2 rounded-full z-10"
                        aria-label="Next image"><ChevronRight className="h-4 w-4" /></button>
                    </>
                  )}
                </div>
              </div>

              {/* Mobile pagination dots */}
              {images.length > 1 && (
                <div className="lg:hidden flex justify-center gap-1.5 mt-3">
                  {images.map((_, i) => (
                    <button key={i} type="button" onClick={() => setCurrentImage(i)}
                      className={`h-1.5 transition-all ${i === currentImage ? 'w-6 bg-primary' : 'w-1.5 bg-border'}`}
                      aria-label={`Go to image ${i + 1}`} />
                  ))}
                </div>
              )}

              {/* Trust badges — below gallery */}
              <div className="grid grid-cols-3 gap-2 mt-5">
                {[
                  { icon: Truck, label: 'Free Shipping', sub: 'Pan India' },
                  { icon: Shield, label: 'Secure Payment', sub: '100% Safe' },
                  { icon: RotateCcw, label: 'Easy Returns', sub: '7-day Policy' },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="text-center p-3 border border-border/70">
                    <Icon className="h-5 w-5 mx-auto mb-1.5 text-accent" />
                    <p className="font-display text-[9px] font-bold tracking-wider text-foreground uppercase">{label}</p>
                    <p className="font-body text-[9px] text-muted-foreground">{sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Product Details ── */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-5"
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
                <span className="font-display text-3xl md:text-4xl font-bold">{formatPrice(Number(displayPrice))}</span>
                {displayOriginalPrice && (
                  <span className="font-body text-base text-muted-foreground line-through">{formatPrice(Number(displayOriginalPrice))}</span>
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

              <div className="ornate-line" />

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


              {/* CTAs — Add to Cart only (Kankatala-style) */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => { if (canAddToCart) addToCart(cartProduct); }}
                  disabled={!canAddToCart}
                  className={`w-full py-4 text-[11px] tracking-[0.25em] font-display font-bold flex items-center justify-center gap-3 transition-colors uppercase border-2 ${
                    canAddToCart ? 'border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-background' : 'border-muted text-muted-foreground cursor-not-allowed bg-background'
                  }`}
                >
                  <ShoppingBag className="h-4 w-4" />
                  {hasVariants && !allAttributesSelected ? 'Select Options Above' : !isInStock ? 'Out of Stock' : 'Add To Cart'}
                </button>
              </div>



              {/* Highlights — horizontal scroll carousel */}
              {highlights.length > 0 && (
                <div className="pt-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-3.5 w-3.5 text-accent" />
                    <h3 className="font-display text-[11px] font-bold tracking-[0.15em] uppercase">Highlights</h3>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory [scrollbar-width:thin]">
                    {highlights.map(h => (
                      <div
                        key={h.title}
                        className="snap-start shrink-0 w-[200px] border border-border bg-muted/30 p-3 flex flex-col gap-1"
                      >
                        <span className="text-base leading-none">{h.icon}</span>
                        <p className="font-display text-[10px] font-bold tracking-wider text-primary uppercase">{h.title}</p>
                        <p className="font-body text-[12px] text-foreground/80 leading-snug">{h.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Delivery & Availability */}
              <CollapsibleSection title="Delivery & Availability" defaultOpen>
                <div className="space-y-4">
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const pin = pincode.trim();
                      if (!/^\d{6}$/.test(pin)) {
                        setPincodeStatus({ ok: false, eta: '', cod: false, message: 'Enter a valid 6-digit Indian pincode.' });
                        return;
                      }
                      setPincodeChecking(true);
                      try {
                        const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
                        const json = await res.json();
                        const office = Array.isArray(json) && json[0]?.PostOffice?.[0];
                        if (!office) {
                          setPincodeStatus({ ok: false, eta: '', cod: false, message: 'Pincode not serviceable. Please try another.' });
                          return;
                        }
                        const state = office.State as string;
                        const district = (office.District || office.Name) as string;
                        const fastStates = ['Telangana', 'Andhra Pradesh', 'Karnataka', 'Tamil Nadu', 'Maharashtra'];
                        const isFast = fastStates.includes(state);
                        const minDays = isFast ? 2 : 4;
                        const maxDays = isFast ? 4 : 7;
                        const min = new Date(); min.setDate(min.getDate() + minDays);
                        const max = new Date(); max.setDate(max.getDate() + maxDays);
                        const fmt = (d: Date) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
                        const noCodStates = ['Andaman and Nicobar Islands', 'Lakshadweep'];
                        const cod = !noCodStates.includes(state);
                        setPincodeStatus({ ok: true, eta: `${fmt(min)} – ${fmt(max)}`, cod, city: `${district}, ${state}`, message: '' });
                      } catch {
                        setPincodeStatus({ ok: false, eta: '', cod: false, message: 'Could not verify pincode. Please try again.' });
                      } finally {
                        setPincodeChecking(false);
                      }
                    }}
                    className="flex items-stretch gap-2"
                  >
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="\d{6}"
                      maxLength={6}
                      value={pincode}
                      onChange={e => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="Enter delivery pincode"
                      aria-label="Delivery pincode"
                      className="flex-1 min-h-[44px] px-3 py-2 text-sm font-body border border-border bg-background focus:outline-none focus:border-primary"
                    />
                    <button
                      type="submit"
                      disabled={pincodeChecking || pincode.length !== 6}
                      className="min-h-[44px] px-4 text-[11px] tracking-[0.2em] font-display font-bold uppercase border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                    >
                      {pincodeChecking ? (<><Loader2 className="h-3.5 w-3.5 animate-spin" />Checking</>) : 'Check'}
                    </button>
                  </form>

                  {pincodeChecking && (
                    <div className="flex items-center gap-2 text-[13px] font-body text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" /> Verifying serviceability…
                    </div>
                  )}

                  {pincodeStatus && !pincodeStatus.ok && !pincodeChecking && (
                    <div className="flex items-start gap-2 p-3 border border-red-300 bg-red-50 dark:bg-red-950/20" role="alert">
                      <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                      <div className="font-body text-[13px]">
                        <p className="font-semibold text-red-700 dark:text-red-400">Delivery not available</p>
                        <p className="text-red-700/80 dark:text-red-400/80 text-[12px] mt-0.5">{pincodeStatus.message}</p>
                      </div>
                    </div>
                  )}

                  {pincodeStatus?.ok && !pincodeChecking && (
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 p-3 border border-emerald-600/30 bg-emerald-50 dark:bg-emerald-950/20">
                        <Check className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                        <div className="font-body text-[13px]">
                          <p className="font-semibold text-emerald-700 dark:text-emerald-400">
                            Delivery available to {pincodeStatus.city}
                          </p>
                          <p className="text-muted-foreground text-[12px] mt-0.5">
                            Estimated arrival {pincodeStatus.eta} · {pincodeStatus.cod ? 'COD available' : 'Prepaid only'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 p-3 border border-border bg-muted/30">
                        <CalendarCheck className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                        <div className="font-body text-[13px]">
                          <p className="font-semibold text-foreground">Dispatches {fmtDate(cutoffInfo.dispatchDate)}</p>
                          <p className="text-muted-foreground text-[12px] mt-0.5 inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {cutoffInfo.beforeCutoff
                              ? `Order in ${cutoffInfo.hoursLeft}h ${cutoffInfo.minsLeft}m to ship today (cutoff 2:00 PM IST)`
                              : 'Today\'s cutoff (2:00 PM IST) has passed — ships next business day'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <ul className="space-y-3 font-body text-sm text-foreground/80">
                    <li className="flex items-start gap-3">
                      <Truck className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-foreground">Estimated delivery</p>
                        <p className="text-muted-foreground text-[13px]">
                          {pincodeStatus?.ok
                            ? `${pincodeStatus.eta} — ${pincodeStatus.city}`
                            : (() => {
                                const min = new Date(); min.setDate(min.getDate() + 4);
                                const max = new Date(); max.setDate(max.getDate() + 7);
                                const fmt = (d: Date) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
                                return `${fmt(min)} – ${fmt(max)} (3–7 business days, pan-India)`;
                              })()}
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className={`h-4 w-4 mt-0.5 shrink-0 ${pincodeStatus?.ok && !pincodeStatus.cod ? 'text-red-600' : 'text-emerald-600'}`} />
                      <div>
                        <p className="font-medium text-foreground">
                          {pincodeStatus?.ok
                            ? (pincodeStatus.cod ? 'Cash on Delivery available' : 'COD not available for this pincode')
                            : 'Cash on Delivery available'}
                        </p>
                        <p className="text-muted-foreground text-[13px]">For orders below ₹20,000.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Shield className={`h-4 w-4 mt-0.5 shrink-0 ${isInStock ? 'text-emerald-600' : 'text-red-600'}`} />
                      <div>
                        <p className="font-medium text-foreground">
                          {hasVariants && !allAttributesSelected
                            ? 'Select options to see availability'
                            : isInStock
                            ? `In stock${displayStock <= 5 ? ` — only ${displayStock} left` : ''}`
                            : 'Currently out of stock'}
                        </p>
                        <p className="text-muted-foreground text-[13px]">Ships from Hyderabad, Telangana.</p>
                      </div>
                    </li>
                  </ul>
                </div>

              </CollapsibleSection>

              {/* Collapsible Description */}
              {product.description && (
                <CollapsibleSection title="Product Description" defaultOpen>
                  <div className="font-body text-sm text-foreground/80 leading-relaxed whitespace-pre-line space-y-3">
                    {product.description.split(/\n{2,}/).map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </CollapsibleSection>
              )}

              {/* Specific Information — structured details table */}
              {structuredEntries.length > 0 && (
                <CollapsibleSection title="Specific Information" defaultOpen>
                  <div className="overflow-hidden border border-border/60">
                    <table className="w-full text-left">
                      <tbody className="divide-y divide-border/40">
                        {structuredEntries.map(([k, v], idx) => (
                          <tr key={k} className={idx % 2 === 0 ? 'bg-muted/30' : 'bg-background'}>
                            <th scope="row" className="font-display text-[11px] font-bold tracking-wider text-primary uppercase px-3 py-2.5 w-2/5 align-top">{k}</th>
                            <td className="font-body text-[13px] text-foreground/85 px-3 py-2.5">{v}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CollapsibleSection>
              )}

              {/* Care Information */}
              <CollapsibleSection title="Care Information" defaultOpen={false}>
                <div className="space-y-3">
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
              </CollapsibleSection>

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


      {/* Mobile sticky buy bar — above MobileBottomNav */}
      <div className="lg:hidden fixed inset-x-0 bottom-16 z-40 bg-background/95 backdrop-blur border-t border-border px-3 py-2 flex items-center gap-3 shadow-[0_-4px_12px_-4px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col leading-tight min-w-0">
          <span className="font-display text-base font-bold truncate">{formatPrice(Number(displayPrice))}</span>
          {displayOriginalPrice && (
            <span className="font-body text-[11px] text-muted-foreground line-through">{formatPrice(Number(displayOriginalPrice))}</span>
          )}
        </div>
        <button
          onClick={() => {
            if (!isLoggedIn) { toast.error('Please login to use wishlist'); return; }
            if (product) toggleWishlist(product.id);
          }}
          className={`min-h-[44px] p-2.5 border ${isWishlisted(product.id) ? 'border-primary text-primary bg-primary/10' : 'border-border'}`}
          aria-label="Wishlist"
        >
          <Heart className={`h-4 w-4 ${isWishlisted(product.id) ? 'fill-current' : ''}`} />
        </button>
        <button
          onClick={() => { if (canAddToCart) addToCart(cartProduct); }}
          disabled={!canAddToCart}
          className={`flex-1 min-h-[44px] text-[11px] tracking-[0.2em] font-display font-bold uppercase border-2 inline-flex items-center justify-center gap-2 ${
            canAddToCart ? 'border-primary bg-primary text-primary-foreground' : 'border-muted text-muted-foreground bg-background cursor-not-allowed'
          }`}
        >
          <ShoppingBag className="h-4 w-4" />
          {hasVariants && !allAttributesSelected ? 'Select Options' : !isInStock ? 'Out of Stock' : 'Add To Cart'}
        </button>
      </div>

      <Footer />
    </div>
  );
}

export default ProductDetail;
