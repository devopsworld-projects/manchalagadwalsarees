import { useSearchParams, Link } from 'react-router-dom';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Footer } from '@/components/Footer';
import { PageMeta } from '@/components/PageMeta';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo.png';

export default function OrderConfirmation() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id') || '';
  const method = searchParams.get('method') || 'online';

  return (
    <div className="min-h-screen">
      <PageMeta
        title="Order Confirmed"
        description="Thank you for your order at Manchala Gadwal Sarees. Your handwoven Gadwal silk saree is on its way."
        canonicalPath="/order-confirmation"
      />
      <AnnouncementBar />
      <Navbar /><Breadcrumbs />
      <main className="container max-w-xl py-14 md:py-20">
        {/* Branded header */}
        <div className="text-center mb-8">
          <img
            src={logo}
            alt="Manchala Gadwal Sarees"
            className="h-20 w-auto mx-auto mb-4"
            width={1024}
            height={1024}
          />
          <div className="w-16 ornate-line mx-auto" />
        </div>

        <div className="bg-card border border-border rounded-lg p-8 md:p-10 text-center shadow-sm">
          <div className="bg-emerald-50 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-emerald-600" />
          </div>

          <span className="text-accent text-[8px] tracking-[0.5em] block">◆&nbsp;&nbsp;◆&nbsp;&nbsp;◆</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-primary mb-3 mt-3">
            Order Confirmed
          </h1>
          <p className="text-muted-foreground font-serif italic text-lg mb-6">
            Thank you for shopping with Manchala Gadwal Sarees.
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

          <div className="bg-primary/5 border border-primary/15 rounded-lg p-4 mb-8">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-accent shrink-0" />
              <p className="font-body text-sm text-foreground/80 text-left">
                {method === 'cod'
                  ? 'Your saree will be carefully packed and shipped soon. Please keep the exact amount ready for delivery.'
                  : 'Your order has been confirmed. Your saree will be carefully packed and shipped within 1–2 business days.'}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="outline" className="font-body tracking-wider uppercase text-xs">
              <Link to="/orders">View Orders</Link>
            </Button>
            <Button asChild className="font-body tracking-wider uppercase text-xs bg-primary hover:bg-primary/90">
              <Link to="/collections">
                Continue Shopping <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>

        <p className="text-center font-serif italic text-sm text-muted-foreground mt-8">
          For any queries, contact us at <a href="mailto:info@manchalagadwalsarees.com" className="text-primary hover:underline">info@manchalagadwalsarees.com</a>
        </p>
      </main>
      <Footer />
    </div>
  );
}
