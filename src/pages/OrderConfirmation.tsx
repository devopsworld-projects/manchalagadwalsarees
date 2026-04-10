import { useSearchParams, Link } from 'react-router-dom';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PageMeta } from '@/components/PageMeta';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OrderConfirmation() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id') || '';
  const method = searchParams.get('method') || 'online';

  return (
    <div className="min-h-screen">
      <PageMeta title="Order Confirmed" description="Your order has been placed successfully." canonicalPath="/order-confirmation" />
      <AnnouncementBar />
      <Navbar />
      <main className="container max-w-lg py-16 md:py-24 text-center">
        <div className="bg-emerald-50 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-emerald-600" />
        </div>

        <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">Order Confirmed!</h1>
        <p className="text-muted-foreground font-body mb-6">
          Thank you for shopping with Kavi Women's World.
        </p>

        {orderId && (
          <div className="bg-muted/40 border border-border rounded-lg p-5 mb-6 text-left space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-body text-sm text-muted-foreground">Order ID</span>
              <span className="font-mono text-sm font-medium">{orderId.slice(0, 8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-body text-sm text-muted-foreground">Payment</span>
              <span className="font-body text-sm font-medium">
                {method === 'cod' ? 'Cash on Delivery' : 'Paid Online'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-body text-sm text-muted-foreground">Status</span>
              <span className="font-body text-sm font-medium text-emerald-600">
                {method === 'cod' ? 'Awaiting Delivery' : 'Confirmed'}
              </span>
            </div>
          </div>
        )}

        <div className="bg-muted/30 border border-border rounded-lg p-4 mb-8">
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-gold shrink-0" />
            <p className="font-body text-sm text-muted-foreground text-left">
              {method === 'cod'
                ? 'Your order will be shipped soon. Please keep the exact amount ready for delivery.'
                : 'Your order has been confirmed and will be shipped within 1-2 business days.'}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="outline" className="font-body tracking-wider uppercase text-xs">
            <Link to="/orders">View Orders</Link>
          </Button>
          <Button asChild className="font-body tracking-wider uppercase text-xs">
            <Link to="/collections">
              Continue Shopping <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
