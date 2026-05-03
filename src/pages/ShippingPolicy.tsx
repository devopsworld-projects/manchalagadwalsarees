import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Footer } from '@/components/Footer';
import { PageMeta } from '@/components/PageMeta';

const ShippingPolicy = () => (
  <div className="min-h-screen">
    <PageMeta title="Shipping Policy" description="Shipping and delivery policy for Manchala Gadwal Sarees orders." canonicalPath="/shipping-policy" />
    <AnnouncementBar />
    <Navbar /><Breadcrumbs />
    <main className="container max-w-3xl py-12 md:py-16">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">Shipping Policy</h1>
      <div className="prose prose-sm max-w-none font-body text-muted-foreground space-y-6">
        <p className="text-sm">Last updated: April 2026</p>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-foreground">Free Shipping</h2>
          <p>We offer <strong>free standard shipping</strong> on all orders across India. No minimum order value required.</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-foreground">Processing Time</h2>
          <p>Orders are processed within 1–2 business days after payment confirmation. You will receive an update once your order is shipped.</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-foreground">Delivery Timeline</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Metro cities:</strong> 3–5 business days</li>
            <li><strong>Other cities:</strong> 5–7 business days</li>
            <li><strong>Remote areas:</strong> 7–10 business days</li>
          </ul>
          <p>These are estimated timelines and may vary due to unforeseen circumstances.</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-foreground">Order Tracking</h2>
          <p>You can track your order status from your account's <strong>Order History</strong> page. We will also notify you via email when your order ships.</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-foreground">Delivery Issues</h2>
          <p>If your order is delayed beyond the estimated timeframe, or if you receive a damaged package, please contact us immediately at <strong>info@manchalagadwalsarees.com</strong> or call <strong>+91 98858 79188</strong>.</p>
        </section>
      </div>
    </main>
    <Footer />
  </div>
);

export default ShippingPolicy;
