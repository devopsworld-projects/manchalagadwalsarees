import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Facebook, Youtube, ArrowRight, Send } from 'lucide-react';
import { useState } from 'react';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import { useMenuItems } from '@/hooks/useMenuItems';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import logo from '@/assets/logo.png';

function getItemUrl(item: { slug: string | null; url: string | null }) {
  if (item.url) return item.url;
  if (item.slug) return `/collections?filter=${item.slug}`;
  return '/collections';
}

export function Footer() {
  const { data: settings } = useStoreSettings();
  const { data: footerMenuItems = [] } = useMenuItems('footer');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const logoSrc = settings?.logo_url || logo;
  const description = settings?.footer_description || 'Discover the finest collection of handcrafted sarees that blend traditional artistry with contemporary grace.';
  const phone = settings?.store_phone || '+91 98858 79188';
  const whatsappNumber = settings?.whatsapp_number || '919885879188';
  const storeEmail = settings?.store_email || 'info@manchalagadwalsarees.com';
  const address = settings?.store_address || 'Hyderabad, Telangana, India';
  const igUrl = settings?.social_instagram || 'https://instagram.com';
  const fbUrl = settings?.social_facebook || 'https://facebook.com';
  const ytUrl = settings?.social_youtube || 'https://youtube.com';

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      const normalized = email.trim().toLowerCase();
      const { data: existing } = await supabase
        .from('newsletter_subscribers')
        .select('id')
        .ilike('email', normalized)
        .maybeSingle();
      if (existing) {
        toast({ title: 'Already subscribed', description: 'This email is already on our list.' });
        setEmail('');
        return;
      }
      const { error } = await supabase.from('newsletter_subscribers').insert({ email: normalized });
      if (error) {
        if ((error as any).code === '23505') {
          toast({ title: 'Already subscribed', description: 'This email is already on our list.' });
          setEmail('');
          return;
        }
        throw error;
      }
      toast({ title: 'Welcome to the family', description: 'You will hear from us soon.' });
      setEmail('');
    } catch (err: any) {
      toast({ title: 'Subscription failed', description: err.message || 'Try again later', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const renderFooterLinks = () => {
    if (footerMenuItems.length > 0) {
      return footerMenuItems.map(group => (
        <div key={group.id}>
          <h4 className="font-display text-[11px] font-bold text-background tracking-[0.25em] uppercase mb-6 relative inline-block">
            {group.label}
            <span className="absolute -bottom-2 left-0 w-8 h-px bg-gradient-to-r from-accent to-transparent" />
          </h4>
          <ul className="space-y-3 mt-4">
            {(group.children || []).map(child => (
              <li key={child.id}>
                <Link
                  to={getItemUrl(child)}
                  className="group/link flex items-center gap-2 text-sm font-body text-background/65 hover:text-accent transition-colors tracking-wide"
                >
                  <span className="w-0 group-hover/link:w-3 h-px bg-accent transition-all duration-300" />
                  {child.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ));
    }

    return (
      <>
        <div>
          <h4 className="font-display text-[11px] font-bold text-background tracking-[0.25em] uppercase mb-6 relative inline-block">
            Quick Links
            <span className="absolute -bottom-2 left-0 w-8 h-px bg-gradient-to-r from-accent to-transparent" />
          </h4>
          <ul className="space-y-3 mt-4">
            {['Home', 'Collections', 'New Arrivals', 'About', 'Contact'].map(link => (
              <li key={link}>
                <Link
                  to={link === 'Home' ? '/' : `/${link.toLowerCase().replace(' ', '-')}`}
                  className="group/link flex items-center gap-2 text-sm font-body text-background/65 hover:text-accent transition-colors tracking-wide"
                >
                  <span className="w-0 group-hover/link:w-3 h-px bg-accent transition-all duration-300" />
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-display text-[11px] font-bold text-background tracking-[0.25em] uppercase mb-6 relative inline-block">
            Categories
            <span className="absolute -bottom-2 left-0 w-8 h-px bg-gradient-to-r from-accent to-transparent" />
          </h4>
          <ul className="space-y-3 mt-4">
            {['Pattu Sarees', 'Banarasi', 'Premium', 'Best Sellers', 'Offers'].map(cat => (
              <li key={cat}>
                <Link
                  to={`/collections?filter=${cat.toLowerCase().replace(' ', '-')}`}
                  className="group/link flex items-center gap-2 text-sm font-body text-background/65 hover:text-accent transition-colors tracking-wide"
                >
                  <span className="w-0 group-hover/link:w-3 h-px bg-accent transition-all duration-300" />
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </>
    );
  };

  return (
    <footer className="relative bg-foreground text-background/60 overflow-hidden">
      {/* Decorative top gradient line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-accent/60 to-transparent" />

      {/* Subtle background ornament */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: 'radial-gradient(circle at 20% 0%, hsl(var(--accent)) 0%, transparent 40%), radial-gradient(circle at 80% 100%, hsl(var(--accent)) 0%, transparent 40%)',
      }} />

      {/* ─── Newsletter band ─── */}
      <div className="relative border-b border-background/10">
        <div className="container py-12 md:py-14">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="font-display text-[10px] tracking-[0.35em] text-accent uppercase mb-3">Join Our Heritage</p>
              <h3 className="font-serif text-2xl md:text-3xl text-background italic leading-tight">
                Receive exclusive previews, weaver stories &amp; private offers.
              </h3>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex w-full md:justify-end">
              <div className="flex w-full md:max-w-md group/input">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 bg-background/5 border border-background/15 px-4 py-3 text-sm font-body text-background placeholder:text-background/40 focus:outline-none focus:border-accent transition-colors"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-accent text-foreground px-5 py-3 font-display text-[11px] tracking-[0.2em] uppercase hover:bg-accent/90 transition-colors flex items-center gap-2 disabled:opacity-60"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Subscribe</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ─── Main Footer Content ─── */}
      <div className="relative container py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <img src={logoSrc} alt="Manchala Gadwal Sarees" className="h-20 w-auto mb-5 brightness-200" loading="lazy" width={512} height={512} />
            <p className="font-serif text-sm leading-relaxed text-background/65 italic mb-6 max-w-xs">
              {description}
            </p>

            {/* Social icons */}
            <div className="flex gap-2.5">
              {[
                { url: igUrl, Icon: Instagram, label: 'Instagram' },
                { url: fbUrl, Icon: Facebook, label: 'Facebook' },
                { url: ytUrl, Icon: Youtube, label: 'YouTube' },
                { url: `https://wa.me/${whatsappNumber}`, Icon: WhatsAppIcon, label: 'WhatsApp' },
              ].map(({ url, Icon, label }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 border border-background/20 flex items-center justify-center text-background/70 hover:border-accent hover:text-accent hover:bg-accent/10 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {renderFooterLinks()}

          {/* Contact column */}
          <div>
            <h4 className="font-display text-[11px] font-bold text-background tracking-[0.25em] uppercase mb-6 relative inline-block">
              Contact Us
              <span className="absolute -bottom-2 left-0 w-8 h-px bg-gradient-to-r from-accent to-transparent" />
            </h4>
            <ul className="space-y-4 mt-4">
              <li>
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="group/c flex items-center gap-3 text-sm font-body text-background/70 hover:text-accent transition-colors">
                  <span className="w-9 h-9 border border-accent/25 flex items-center justify-center shrink-0 group-hover/c:bg-accent/10 group-hover/c:border-accent transition-all">
                    <Phone className="h-3.5 w-3.5 text-accent" />
                  </span>
                  {phone}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=Hi%2C%20I%27m%20interested%20in%20your%20sarees!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/c flex items-center gap-3 text-sm font-body text-background/70 hover:text-[#25D366] transition-colors"
                >
                  <span className="w-9 h-9 border border-accent/25 flex items-center justify-center shrink-0 group-hover/c:bg-[#25D366]/10 group-hover/c:border-[#25D366] transition-all">
                    <WhatsAppIcon className="h-3.5 w-3.5 text-[#25D366]" />
                  </span>
                  Chat on WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${storeEmail}`} className="group/c flex items-start gap-3 text-sm font-body text-background/70 hover:text-accent transition-colors">
                  <span className="w-9 h-9 border border-accent/25 flex items-center justify-center shrink-0 group-hover/c:bg-accent/10 group-hover/c:border-accent transition-all">
                    <Mail className="h-3.5 w-3.5 text-accent" />
                  </span>
                  <span className="break-all pt-2">{storeEmail}</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm font-body text-background/70">
                <span className="w-9 h-9 border border-accent/25 flex items-center justify-center shrink-0">
                  <MapPin className="h-3.5 w-3.5 text-accent" />
                </span>
                <span className="pt-2">{address}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-14 pt-10 border-t border-background/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { title: 'Authentic', sub: 'Handwoven Sarees' },
            { title: 'Free Shipping', sub: 'Across India' },
            { title: 'Easy Returns', sub: '7-Day Policy' },
            { title: 'Secure Payments', sub: 'Trusted Gateway' },
          ].map(item => (
            <div key={item.title} className="group/badge">
              <p className="font-display text-[11px] tracking-[0.25em] text-accent uppercase mb-1.5 group-hover/badge:tracking-[0.3em] transition-all duration-500">
                {item.title}
              </p>
              <p className="font-serif text-xs italic text-background/55">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Bottom Bar ─── */}
      <div className="relative border-t border-background/10 bg-background/[0.02]">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2">
            <Link to="/privacy-policy" className="text-[10px] font-display tracking-[0.25em] text-background/55 hover:text-accent transition-colors uppercase">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-[10px] font-display tracking-[0.25em] text-background/55 hover:text-accent transition-colors uppercase">
              Terms &amp; Conditions
            </Link>
            <Link to="/shipping-policy" className="text-[10px] font-display tracking-[0.25em] text-background/55 hover:text-accent transition-colors uppercase">
              Shipping Policy
            </Link>
          </div>

          <p className="font-body text-[11px] text-background/45 tracking-[0.1em] text-center">
            © {new Date().getFullYear()} Manchala Gadwal Sarees · <span className="text-accent/70">Crafted with devotion</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
