import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ShoppingBag, ArrowLeft, CheckCircle, CreditCard, Truck } from 'lucide-react';
import { RazorpayPayment } from '@/components/RazorpayPayment';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');

  const [form, setForm] = useState({
    name: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    notes: '',
  });

  const update = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const fullAddress = `${form.address}, ${form.city}, ${form.state} - ${form.pincode}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (paymentMethod === 'razorpay') {
      setShowPayment(true);
    } else {
      await placeOrder('COD');
    }
  };

  const placeOrder = async (paymentRef: string) => {
    setLoading(true);
    try {
      const status = paymentRef === 'COD' ? 'pending' : 'confirmed';
      const notesText = form.notes ? `${form.notes} | Payment: ${paymentRef}` : `Payment: ${paymentRef}`;

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: form.name,
          customer_email: form.email,
          customer_phone: form.phone || null,
          shipping_address: fullAddress,
          notes: notesText,
          total: totalPrice,
          user_id: user?.id || null,
          status,
        })
        .select('id')
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      clearCart();
      setOrderPlaced(order.id);
      toast.success(paymentRef === 'COD' ? 'Order placed! Pay on delivery.' : 'Payment successful! Order placed.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentId: string) => {
    setShowPayment(false);
    await placeOrder(paymentId);
  };

  // Order confirmation
  if (orderPlaced) {
    return (
      <div className="min-h-screen">
        <AnnouncementBar />
        <Navbar />
        <main className="container max-w-lg py-20 text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="font-display text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground font-body mb-1">Thank you for your order.</p>
          <p className="text-sm text-muted-foreground font-body mb-6">
            Order ID: <span className="font-mono text-foreground">{orderPlaced.slice(0, 8)}</span>
          </p>
          <p className="text-sm text-muted-foreground font-body mb-8">
            We'll send a confirmation to <strong>{form.email}</strong> shortly.
          </p>
          <Button onClick={() => navigate('/collections')} className="font-body tracking-wider uppercase text-xs">
            Continue Shopping
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <AnnouncementBar />
        <Navbar />
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
      <AnnouncementBar />
      <Navbar />
      <main className="container py-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground font-body mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <h1 className="font-display text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Shipping form */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-5">
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

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-body text-muted-foreground mb-1 block">City *</label>
                <Input value={form.city} onChange={e => update('city', e.target.value)} required className="font-body" />
              </div>
              <div>
                <label className="text-xs font-body text-muted-foreground mb-1 block">State *</label>
                <Input value={form.state} onChange={e => update('state', e.target.value)} required className="font-body" />
              </div>
              <div>
                <label className="text-xs font-body text-muted-foreground mb-1 block">PIN Code *</label>
                <Input value={form.pincode} onChange={e => update('pincode', e.target.value)} required pattern="[0-9]{6}" className="font-body" />
              </div>
            </div>

            <div>
              <label className="text-xs font-body text-muted-foreground mb-1 block">Order Notes (optional)</label>
              <Textarea value={form.notes} onChange={e => update('notes', e.target.value)} rows={2} placeholder="Special instructions..." className="font-body" />
            </div>

            {/* Payment Method */}
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
                <Label htmlFor="cod" className="flex items-center gap-3 border border-border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
                  <RadioGroupItem value="cod" id="cod" />
                  <Truck className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-body text-sm font-medium">Cash on Delivery</p>
                    <p className="font-body text-xs text-muted-foreground">Pay when your order arrives</p>
                  </div>
                </Label>
              </RadioGroup>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-12 font-body tracking-wider uppercase text-xs">
              {loading ? 'Placing Order...' : paymentMethod === 'cod' ? `Place Order — ₹${totalPrice.toLocaleString()}` : `Pay ₹${totalPrice.toLocaleString()}`}
            </Button>

            <p className="text-xs text-muted-foreground text-center font-body">
              {paymentMethod === 'razorpay' ? 'Powered by Razorpay (Sandbox Mode)' : 'Pay cash when your order is delivered'}
            </p>
          </form>

          {showPayment && (
            <RazorpayPayment
              amount={totalPrice}
              customerName={form.name}
              customerEmail={form.email}
              customerPhone={form.phone}
              onSuccess={handlePaymentSuccess}
              onCancel={() => setShowPayment(false)}
            />
          )}

          {/* Order summary */}
          <div className="lg:col-span-2">
            <div className="bg-muted/30 rounded-lg border border-border p-5 sticky top-28">
              <h2 className="font-display text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex gap-3">
                    <img src={product.image} alt={product.name} className="h-16 w-12 object-cover rounded-sm shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm font-medium truncate">{product.name}</p>
                      <p className="font-body text-xs text-muted-foreground">Qty: {quantity}</p>
                    </div>
                    <span className="font-body text-sm font-bold shrink-0">
                      ₹{(product.price * quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 space-y-2">
                <div className="flex justify-between font-body text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-body text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between font-body font-bold text-lg pt-2 border-t border-border">
                  <span>Total</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
