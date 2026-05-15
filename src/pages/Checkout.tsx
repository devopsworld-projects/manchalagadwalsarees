import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Footer } from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ShoppingBag, ArrowLeft, CreditCard, Truck, Tag, X, Zap } from 'lucide-react';
import { RazorpayPayment } from '@/components/RazorpayPayment';
import { PageMeta } from '@/components/PageMeta';
import { useCurrency } from '@/context/CurrencyContext';
import { AddressPicker, SavedAddress } from '@/components/AddressPicker';
import type { CartProduct } from '@/context/CartContext';

interface BuyNowState { buyNow?: { product: CartProduct; quantity: number } }

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items: cartItems, totalPrice: cartTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { format, currency } = useCurrency();
  const { data: settings } = useStoreSettings();

  // Express ("Buy Now") item passed via navigation state
  const buyNow = (location.state as BuyNowState)?.buyNow;
  const isExpress = !!buyNow;

  const items = isExpress ? [{ product: buyNow!.product, quantity: buyNow!.quantity }] : cartItems;
  const totalPrice = isExpress
    ? buyNow!.product.price * buyNow!.quantity
    : cartTotalPrice;

  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<SavedAddress | null>(null);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [destination, setDestination] = useState<'india' | 'international'>(
    currency.code === 'INR' ? 'india' : 'international'
  );
  const [destinationTouched, setDestinationTouched] = useState(false);
  const [autoDetectedCountry, setAutoDetectedCountry] = useState<string | null>(null);
  const [locationAccuracyKm, setLocationAccuracyKm] = useState<number | null>(null);

  // Auto-detect user's location via IP (only if user hasn't manually chosen)
  useEffect(() => {
    if (destinationTouched) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled || !data?.country_code) return;
        const code = String(data.country_code).toUpperCase();
        const accuracyM = data.location_accuracy ? Number(data.location_accuracy) : null;
        setAutoDetectedCountry(data.country_name || code);
        setLocationAccuracyKm(accuracyM ? Math.round(accuracyM / 100) / 10 : null);
      } catch {
        // Silent fail — fall back to currency-based default
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data: shippingRates = [] } = useQuery({
    queryKey: ['shipping-rates'],
    queryFn: async () => (await supabase.from('shipping_rates').select('*').eq('is_active', true)).data || [],
  });
  const { data: taxRules = [] } = useQuery({
    queryKey: ['tax-rules'],
    queryFn: async () => (await supabase.from('tax_rules').select('*').eq('is_active', true)).data || [],
  });

  const totalQty = items.reduce((sum, it) => sum + it.quantity, 0);
  const isOverseas = destination === 'international';
  const OVERSEAS_FIRST = 2800;
  const OVERSEAS_ADDITIONAL = 1200;
  const shipping = (() => {
    // International: ₹2800 first saree + ₹1200 each additional. India: free.
    if (isOverseas) {
      return totalQty > 0 ? OVERSEAS_FIRST + Math.max(0, totalQty - 1) * OVERSEAS_ADDITIONAL : 0;
    }
    return 0;
  })();
  const taxRate = taxRules.length > 0 ? Number((taxRules[0] as any).rate || 0) : 0;
  const taxAmount = Math.round(totalPrice * taxRate / 100);
  const discount = appliedCoupon
    ? appliedCoupon.discount_type === 'percentage'
      ? Math.round(totalPrice * appliedCoupon.discount_value / 100)
      : Math.min(appliedCoupon.discount_value, totalPrice)
    : 0;
  const grandTotal = totalPrice + shipping + taxAmount - discount;

  // ── COD eligibility ──
  const codConfig = useMemo(() => {
    const enabled = (settings?.cod_enabled ?? 'true') === 'true';
    const min = Number(settings?.cod_min_order || 0);
    const max = Number(settings?.cod_max_order || 0);
    const mode = (settings?.cod_pincode_mode || 'all') as 'all' | 'allow' | 'block';
    const pincodes = (settings?.cod_pincodes || '')
      .split(/[\s,]+/).map(p => p.trim()).filter(Boolean);
    return { enabled, min, max, mode, pincodes };
  }, [settings]);

  const [form, setForm] = useState({
    name: '', email: user?.email || '', phone: '',
    address: '', city: '', state: '', pincode: '', notes: '',
  });
  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const codCheck = useMemo(() => {
    if (!codConfig.enabled) return { ok: false, reason: 'Cash on Delivery is unavailable.' };
    if (codConfig.min > 0 && grandTotal < codConfig.min) return { ok: false, reason: `COD requires minimum order of ${format(codConfig.min)}` };
    if (codConfig.max > 0 && grandTotal > codConfig.max) return { ok: false, reason: `COD only available for orders up to ${format(codConfig.max)}` };
    const pin = selectedAddress?.pincode || form.pincode;
    if (codConfig.mode === 'allow' && codConfig.pincodes.length > 0 && pin && !codConfig.pincodes.includes(pin)) {
      return { ok: false, reason: 'COD not available at this PIN code' };
    }
    if (codConfig.mode === 'block' && pin && codConfig.pincodes.includes(pin)) {
      return { ok: false, reason: 'COD not available at this PIN code' };
    }
    return { ok: true, reason: '' };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codConfig, grandTotal, selectedAddress?.pincode]);

  // Force razorpay if COD blocked
  useEffect(() => {
    if (paymentMethod === 'cod' && !codCheck.ok) setPaymentMethod('razorpay');
  }, [codCheck.ok, paymentMethod]);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    const { data, error } = await supabase.from('coupons').select('*').eq('code', couponCode.toUpperCase().trim()).eq('is_active', true).maybeSingle();
    setCouponLoading(false);
    if (error || !data) { toast.error('Invalid coupon code'); return; }
    if (data.expires_at && new Date(data.expires_at) < new Date()) { toast.error('Coupon has expired'); return; }
    if (data.max_uses && data.usage_count >= data.max_uses) { toast.error('Coupon usage limit reached'); return; }
    if (totalPrice < (data.min_order_amount || 0)) { toast.error(`Minimum order ${format(data.min_order_amount)}`); return; }
    setAppliedCoupon(data);
    toast.success(`Coupon applied!`);
  };

  useEffect(() => {
    if (!user) { toast.error('Please login to proceed to checkout'); navigate('/login', { replace: true }); return; }
    if (items.length === 0) navigate('/collections', { replace: true });
  }, [items.length, navigate, user]);


  // When an address is selected, prefill form
  useEffect(() => {
    if (selectedAddress) {
      setForm(f => ({
        ...f,
        name: selectedAddress.full_name,
        phone: selectedAddress.phone || '',
        address: selectedAddress.address_line1 + (selectedAddress.address_line2 ? `, ${selectedAddress.address_line2}` : ''),
        city: selectedAddress.city,
        state: selectedAddress.state,
        pincode: selectedAddress.pincode,
      }));
      setUseNewAddress(false);
    }
  }, [selectedAddress]);

  const fullAddress = `${form.address}, ${form.city}, ${form.state} - ${form.pincode}`;

  const validateForm = (): string | null => {
    if (form.name.trim().length < 2) return 'Please enter a valid name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Please enter a valid email';
    if (form.phone && !/^[+]?\d[\d\s-]{7,14}$/.test(form.phone.trim())) return 'Please enter a valid phone number';
    if (form.address.trim().length < 5) return 'Please enter a complete address';
    if (form.city.trim().length < 2) return 'Please enter a valid city';
    if (form.state.trim().length < 2) return 'Please enter a valid state';
    if (!/^\d{6}$/.test(form.pincode)) return 'Please enter a valid 6-digit PIN code';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    const error = validateForm();
    if (error) { toast.error(error); return; }
    if (paymentMethod === 'cod' && !codCheck.ok) { toast.error(codCheck.reason); return; }
    if (paymentMethod === 'razorpay') setShowPayment(true);
    else await placeOrder('COD');
  };

  const placeOrder = async (paymentRef: string) => {
    setLoading(true);
    try {
      const status = paymentRef === 'COD' ? 'pending' : 'confirmed';
      const notesText = form.notes ? `${form.notes} | Payment: ${paymentRef}` : `Payment: ${paymentRef}`;

      const { data: order, error: orderError } = await supabase.from('orders').insert({
        customer_name: form.name, customer_email: form.email,
        customer_phone: form.phone || null, shipping_address: fullAddress,
        notes: notesText, total: totalPrice, user_id: user?.id || null, status,
      }).select('id').single();
      if (orderError) throw orderError;

      const orderItems = items.map(item => ({
        order_id: order.id, product_id: item.product.id,
        product_name: item.product.name, price: item.product.price, quantity: item.quantity,
      }));
      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      if (!isExpress) clearCart();
      const method = paymentRef === 'COD' ? 'cod' : 'online';
      navigate(`/order-confirmation?id=${order.id}&method=${method}`);
      toast.success(paymentRef === 'COD' ? 'Order placed! Pay on delivery.' : 'Payment successful! Order placed.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to place order');
    } finally { setLoading(false); }
  };

  const handlePaymentSuccess = async (paymentId: string) => { setShowPayment(false); await placeOrder(paymentId); };

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <PageMeta title="Checkout" description="Securely complete your Manchala Gadwal Sarees order. Free shipping across India." canonicalPath="/checkout" />
        <AnnouncementBar /><Navbar /><Breadcrumbs />
        <main className="container max-w-lg py-20 text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="font-display text-3xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground font-body mb-6">Add some sarees to get started</p>
          <Button onClick={() => navigate('/collections')} variant="outline" className="font-body tracking-wider uppercase text-xs">
            Browse Collections
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageMeta title={isExpress ? 'Express Checkout' : 'Secure Checkout'} description="Complete your Manchala Gadwal Sarees order securely." canonicalPath="/checkout" />
      <AnnouncementBar /><Navbar /><Breadcrumbs />
      <main className="container py-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground font-body mb-6">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="mb-8">
          <span className="text-accent text-[8px] tracking-[0.5em]">◆&nbsp;&nbsp;MANCHALA GADWAL SAREES&nbsp;&nbsp;◆</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-primary mt-2 flex items-center gap-3">
            {isExpress && <Zap className="h-7 w-7 text-accent fill-accent" />}
            {isExpress ? 'Express Checkout' : 'Secure Checkout'}
          </h1>
          <div className="w-16 ornate-line mt-3" />
        </div>

        <div className="grid lg:grid-cols-5 gap-6 md:gap-8">
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-5">
            {/* Shipping destination */}
            <div>
              <div className="flex items-baseline justify-between mb-3">
                <h2 className="font-display text-lg font-semibold">Shipping To</h2>
                {autoDetectedCountry && !destinationTouched && (
                  <span className="text-xs font-body text-muted-foreground">
                    Detected: {autoDetectedCountry}
                    {locationAccuracyKm != null && ` (~${locationAccuracyKm} km accuracy)`}
                  </span>
                )}
              </div>
              <RadioGroup value={destination} onValueChange={(v) => { setDestination(v as 'india' | 'international'); setDestinationTouched(true); }} className="grid sm:grid-cols-2 gap-3">
                <Label htmlFor="dest-india" className="flex items-center gap-3 border border-border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
                  <RadioGroupItem value="india" id="dest-india" />
                  <div className="flex-1">
                    <p className="font-body text-sm font-medium">India</p>
                    <p className="font-body text-xs text-green-600">Free shipping</p>
                  </div>
                </Label>
                <Label htmlFor="dest-intl" className="flex items-center gap-3 border border-border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
                  <RadioGroupItem value="international" id="dest-intl" />
                  <div className="flex-1">
                    <p className="font-body text-sm font-medium">International</p>
                    <p className="font-body text-xs text-muted-foreground">{format(OVERSEAS_FIRST)} first saree, +{format(OVERSEAS_ADDITIONAL)} each additional</p>
                  </div>
                </Label>
              </RadioGroup>
            </div>

            {/* Saved addresses */}
            <AddressPicker selectedId={selectedAddress?.id || null} onSelect={(a) => { setSelectedAddress(a); setUseNewAddress(false); }} />

            <div className="flex items-center gap-3">
              <button type="button" onClick={() => { setUseNewAddress(v => !v); if (!useNewAddress) setSelectedAddress(null); }}
                className="text-xs font-body text-primary underline">
                {useNewAddress ? 'Use saved address' : '+ Use a new address'}
              </button>
            </div>

            {(useNewAddress || !selectedAddress) && (
              <>
                <h2 className="font-display text-lg font-semibold">Shipping Details</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-body text-muted-foreground mb-1 block">Full Name *</label>
                    <Input value={form.name} onChange={e => update('name', e.target.value)} required className="font-body" />
                  </div>
                  <div>
                    <label className="text-xs font-body text-muted-foreground mb-1 block">Email *</label>
                    <Input type="email" value={form.email} onChange={e => update('email', e.target.value)} required className="font-body" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-body text-muted-foreground mb-1 block">Phone</label>
                  <Input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+91 XXXXX XXXXX" className="font-body" />
                </div>
                <div>
                  <label className="text-xs font-body text-muted-foreground mb-1 block">Address *</label>
                  <Textarea value={form.address} onChange={e => update('address', e.target.value)} required rows={2} className="font-body" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-body text-muted-foreground mb-1 block">City *</label>
                    <Input value={form.city} onChange={e => update('city', e.target.value)} required className="font-body h-11" />
                  </div>
                  <div>
                    <label className="text-xs font-body text-muted-foreground mb-1 block">State *</label>
                    <Input value={form.state} onChange={e => update('state', e.target.value)} required className="font-body h-11" />
                  </div>
                  <div>
                    <label className="text-xs font-body text-muted-foreground mb-1 block">PIN Code *</label>
                    <Input value={form.pincode} onChange={e => update('pincode', e.target.value)} required pattern="[0-9]{6}" inputMode="numeric" className="font-body h-11" />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-xs font-body text-muted-foreground mb-1 block">Order Notes (optional)</label>
              <Textarea value={form.notes} onChange={e => update('notes', e.target.value)} rows={2} placeholder="Special instructions..." className="font-body" />
            </div>

            <div>
              <h2 className="font-display text-lg font-semibold mb-3">Payment Method</h2>
              <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as 'razorpay' | 'cod')} className="gap-3">
                <Label htmlFor="razorpay" className="flex items-center gap-3 border border-border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
                  <RadioGroupItem value="razorpay" id="razorpay" />
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-body text-sm font-medium">Pay Online (Razorpay)</p>
                    <p className="font-body text-xs text-muted-foreground">UPI, Cards, Netbanking, Wallets</p>
                  </div>
                </Label>
                <Label htmlFor="cod" className={`flex items-center gap-3 border border-border rounded-lg p-4 transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5 ${codCheck.ok ? 'cursor-pointer hover:bg-muted/50' : 'opacity-60 cursor-not-allowed'}`}>
                  <RadioGroupItem value="cod" id="cod" disabled={!codCheck.ok} />
                  <Truck className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-body text-sm font-medium">Cash on Delivery</p>
                    <p className="font-body text-xs text-muted-foreground">{codCheck.ok ? 'Pay when your order arrives' : codCheck.reason}</p>
                  </div>
                </Label>
              </RadioGroup>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-12 font-body tracking-wider uppercase text-xs">
              {loading ? 'Placing Order...' : paymentMethod === 'cod' ? `Place Order — ${format(grandTotal)}` : `Pay ${format(grandTotal)}`}
            </Button>
          </form>

          {showPayment && (
            <RazorpayPayment amount={grandTotal} customerName={form.name} customerEmail={form.email}
              customerPhone={form.phone} onSuccess={handlePaymentSuccess} onCancel={() => setShowPayment(false)} />
          )}

          <div className="lg:col-span-2">
            <div className="bg-muted/30 rounded-lg border border-border p-5 sticky top-28">
              <h2 className="font-display text-lg font-semibold mb-4">Order Summary {isExpress && <span className="text-xs text-accent font-body ml-2">(Express)</span>}</h2>
              <div className="space-y-3 mb-4">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex gap-3">
                    <img src={product.image} alt={product.name} className="h-16 w-12 object-cover rounded-sm shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm font-medium truncate">{product.name}</p>
                      <p className="font-body text-xs text-muted-foreground">Qty: {quantity}</p>
                    </div>
                    <span className="font-body text-sm font-bold shrink-0">{format(product.price * quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-50 rounded p-2 mb-2">
                    <div className="flex items-center gap-2"><Tag className="h-3.5 w-3.5 text-green-600" /><span className="font-body text-sm font-medium text-green-700">{appliedCoupon.code}</span></div>
                    <button onClick={() => setAppliedCoupon(null)}><X className="h-4 w-4 text-muted-foreground" /></button>
                  </div>
                ) : (
                  <div className="flex gap-2 mb-2">
                    <Input value={couponCode} onChange={e => setCouponCode(e.target.value)} placeholder="Coupon code" className="flex-1 h-9 text-sm" />
                    <Button variant="outline" size="sm" onClick={applyCoupon} disabled={couponLoading}>{couponLoading ? '...' : 'Apply'}</Button>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between font-body text-sm"><span className="text-muted-foreground">Subtotal</span><span>{format(totalPrice)}</span></div>
                {discount > 0 && <div className="flex justify-between font-body text-sm text-green-600"><span>Discount</span><span>-{format(discount)}</span></div>}
                <div className="flex justify-between font-body text-sm"><span className="text-muted-foreground">Shipping{isOverseas ? ' (International)' : ' (India)'}</span><span className={shipping === 0 ? 'text-green-600' : ''}>{shipping === 0 ? 'Free' : format(shipping)}</span></div>
                {isOverseas && totalQty > 0 && (
                  <div className="ml-3 pl-3 border-l border-border space-y-1 text-xs font-body text-muted-foreground">
                    <div className="flex justify-between"><span>1st saree</span><span>{format(OVERSEAS_FIRST)}</span></div>
                    {totalQty > 1 && (
                      <div className="flex justify-between">
                        <span>+ {totalQty - 1} additional × {format(OVERSEAS_ADDITIONAL)}</span>
                        <span>{format((totalQty - 1) * OVERSEAS_ADDITIONAL)}</span>
                      </div>
                    )}
                  </div>
                )}
                {taxAmount > 0 && <div className="flex justify-between font-body text-sm"><span className="text-muted-foreground">Tax ({taxRate}%)</span><span>{format(taxAmount)}</span></div>}
                <div className="flex justify-between font-body font-bold text-lg pt-2 border-t border-border"><span>Total</span><span>{format(grandTotal)}</span></div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
