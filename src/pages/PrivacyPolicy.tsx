import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PageMeta } from '@/components/PageMeta';

const PrivacyPolicy = () => (
  <div className="min-h-screen">
    <PageMeta title="Privacy Policy" description="Privacy policy for Manchala Gadwal Sarees — how we collect, use, and protect your data." canonicalPath="/privacy-policy" />
    <AnnouncementBar />
    <Navbar />
    <main className="container max-w-3xl py-12 md:py-16">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">Privacy Policy</h1>
      <div className="prose prose-sm max-w-none font-body text-muted-foreground space-y-6">
        <p className="text-sm">Last updated: April 2026</p>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-foreground">1. Information We Collect</h2>
          <p>When you visit our store or place an order, we collect the following information:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Personal details: Name, email address, phone number</li>
            <li>Shipping address and billing information</li>
            <li>Order history and product preferences</li>
            <li>Device and browser information for site analytics</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To process and fulfil your orders</li>
            <li>To communicate about your orders and provide customer support</li>
            <li>To improve our website and product offerings</li>
            <li>To send order-related notifications</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-foreground">3. Data Protection</h2>
          <p>We implement industry-standard security measures to protect your personal information. Your payment details are processed securely through Razorpay and are never stored on our servers.</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-foreground">4. Cookies</h2>
          <p>We use essential cookies to maintain your shopping cart and session. We do not use third-party tracking cookies without your consent.</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-foreground">5. Third-Party Services</h2>
          <p>We share limited data with the following services to operate our store:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Razorpay — for payment processing</li>
            <li>Shipping partners — for order delivery</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-foreground">6. Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal data. Contact us at <strong>info@manchalagadwalsarees.com</strong> for any privacy-related requests.</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-foreground">7. Contact</h2>
          <p>For privacy concerns, reach us at <strong>info@manchalagadwalsarees.com</strong> or call <strong>+91 98858 79188</strong>.</p>
        </section>
      </div>
    </main>
    <Footer />
  </div>
);

export default PrivacyPolicy;
