import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PageMeta } from '@/components/PageMeta';

const Terms = () => (
  <div className="min-h-screen">
    <PageMeta title="Terms & Conditions" description="Terms and conditions for shopping at Manchala Gadwal Sarees." canonicalPath="/terms" />
    <AnnouncementBar />
    <Navbar />
    <main className="container max-w-3xl py-12 md:py-16">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">Terms & Conditions</h1>
      <div className="prose prose-sm max-w-none font-body text-muted-foreground space-y-6">
        <p className="text-sm">Last updated: April 2026</p>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-foreground">1. General</h2>
          <p>By accessing and using the Manchala Gadwal Sarees website, you agree to be bound by these terms and conditions. These terms apply to all visitors, users, and customers.</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-foreground">2. Products & Pricing</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>All prices are in Indian Rupees (INR) and inclusive of applicable taxes</li>
            <li>Product colours may vary slightly from images due to screen settings</li>
            <li>We reserve the right to modify prices without prior notice</li>
            <li>Products are subject to availability</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-foreground">3. Orders & Payment</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Orders are confirmed once payment is received (online) or upon delivery (COD)</li>
            <li>We accept payments via Razorpay (UPI, Cards, Netbanking, Wallets) and Cash on Delivery</li>
            <li>We reserve the right to cancel orders in case of pricing errors or unavailability</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-foreground">4. Shipping & Delivery</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>We ship across India with free standard shipping</li>
            <li>Estimated delivery: 5–10 business days depending on location</li>
            <li>Delivery timelines are estimates and may vary</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-foreground">5. Returns & Exchange</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Returns are accepted within 7 days of delivery for unused and unaltered products</li>
            <li>Items must be in original packaging with all tags intact</li>
            <li>Custom or personalised orders are non-returnable</li>
            <li>Contact us to initiate a return or exchange</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-foreground">6. Intellectual Property</h2>
          <p>All content on this website — including images, text, logos, and designs — is the property of Manchala Gadwal Sarees and may not be reproduced without permission.</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-foreground">7. Limitation of Liability</h2>
          <p>Manchala Gadwal Sarees shall not be liable for any indirect, incidental, or consequential damages arising from the use of this website or purchase of products.</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-foreground">8. Contact</h2>
          <p>For questions regarding these terms, contact us at <strong>info@kaviwomensworld.com</strong> or call <strong>+91 94946 44998</strong>.</p>
        </section>
      </div>
    </main>
    <Footer />
  </div>
);

export default Terms;
