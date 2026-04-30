import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Facebook, Youtube } from 'lucide-react';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import { useMenuItems } from '@/hooks/useMenuItems';
import logo from '@/assets/logo.png';

function getItemUrl(item: { slug: string | null; url: string | null }) {
  if (item.url) return item.url;
  if (item.slug) return `/collections?filter=${item.slug}`;
  return '/collections';
}

export function Footer() {
  const { data: settings } = useStoreSettings();
  const { data: footerMenuItems = [] } = useMenuItems('footer');

  const logoSrc = settings?.logo_url || logo;
  const description = settings?.footer_description || 'Discover the finest collection of handcrafted sarees that blend traditional artistry with contemporary grace.';
  const phone = settings?.store_phone || '+91 94946 44998';
  const email = settings?.store_email || 'info@manchalagadwalsarees.com';
  const address = settings?.store_address || 'Hyderabad, Telangana, India';
  const igUrl = settings?.social_instagram || 'https://instagram.com';
  const fbUrl = settings?.social_facebook || 'https://facebook.com';
  const ytUrl = settings?.social_youtube || 'https://youtube.com';

  const renderFooterLinks = () => {
    if (footerMenuItems.length > 0) {
      return footerMenuItems.map(group => (
        <div key={group.id}>
          <h4 className="font-display text-[11px] font-bold text-background tracking-[0.2em] uppercase mb-6">
            {group.label}
          </h4>
          <ul className="space-y-3">
            {(group.children || []).map(child => (
              <li key={child.id}>
                <Link
                  to={getItemUrl(child)}
className="group/link flex items-center gap-2 text-sm font-body font-normal text-background/70 hover:text-accent transition-colors tracking-wide"
                >
                  <span className="w-0 group-hover/link:w-3 h-[1px] bg-accent transition-all duration-300" />
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
          <h4 className="font-display text-[11px] font-bold text-background tracking-[0.2em] uppercase mb-6">Quick Links</h4>
          <ul className="space-y-3">
            {['Home', 'Collections', 'New Arrivals', 'About', 'Contact'].map(link => (
              <li key={link}>
                <Link
                  to={link === 'Home' ? '/' : `/${link.toLowerCase().replace(' ', '-')}`}
className="group/link flex items-center gap-2 text-sm font-body font-normal text-background/70 hover:text-accent transition-colors tracking-wide"
                >
                  <span className="w-0 group-hover/link:w-3 h-[1px] bg-accent transition-all duration-300" />
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-display text-[11px] font-bold text-background tracking-[0.2em] uppercase mb-6">Categories</h4>
          <ul className="space-y-3">
            {['Pattu Sarees', 'Banarasi', 'Premium', 'Best Sellers', 'Offers'].map(cat => (
              <li key={cat}>
                <Link
                  to={`/collections?filter=${cat.toLowerCase().replace(' ', '-')}`}
                  className="group/link flex items-center gap-2 text-sm font-body font-normal text-background/70 hover:text-accent transition-colors tracking-wide"
                >
                  <span className="w-0 group-hover/link:w-3 h-[1px] bg-accent transition-all duration-300" />
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
    <footer className="bg-foreground text-background/60 relative">
      {/* Top ornate border */}
      <div className="ornate-line" />

      {/* ─── Main Footer Content ─── */}
      <div className="container py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <img src={logoSrc} alt="Manchala Gadwal Sarees" className="h-20 w-auto mb-5 brightness-200" loading="lazy" width={512} height={512} />
            <p className="font-serif text-sm leading-relaxed text-background/60 italic mb-6 max-w-xs">
              {description}
            </p>

            {/* Social icons */}
            <div className="flex gap-2">
              {[
                { url: igUrl, Icon: Instagram },
                { url: fbUrl, Icon: Facebook },
                { url: ytUrl, Icon: Youtube },
              ].map(({ url, Icon }) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 border border-background/20 flex items-center justify-center text-background/60 hover:border-accent hover:text-accent hover:bg-accent/10 transition-all"
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
            <h4 className="font-display text-[11px] font-bold text-background tracking-[0.2em] uppercase mb-6">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li>
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-center gap-3 text-sm font-body font-normal text-background/70 hover:text-accent transition-colors">
                  <span className="w-8 h-8 border border-accent/20 flex items-center justify-center shrink-0">
                    <Phone className="h-3.5 w-3.5 text-accent" />
                  </span>
                  {phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="flex items-start gap-3 text-sm font-body font-normal text-background/70 hover:text-accent transition-colors">
                  <span className="w-8 h-8 border border-accent/20 flex items-center justify-center shrink-0">
                    <Mail className="h-3.5 w-3.5 text-accent" />
                  </span>
                  <span className="break-all pt-1.5">{email}</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm font-body font-normal text-background/70">
                <span className="w-8 h-8 border border-accent/20 flex items-center justify-center shrink-0">
                  <MapPin className="h-3.5 w-3.5 text-accent" />
                </span>
                <span className="pt-1.5">{address}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ─── Bottom Bar ─── */}
      <div className="border-t border-background/8">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Policy links */}
          <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-1">
            <Link to="/privacy-policy" className="text-[10px] font-display tracking-[0.2em] text-background/50 hover:text-accent transition-colors uppercase">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-[10px] font-display tracking-[0.2em] text-background/50 hover:text-accent transition-colors uppercase">
              Terms & Conditions
            </Link>
            <Link to="/shipping-policy" className="text-[10px] font-display tracking-[0.2em] text-background/50 hover:text-accent transition-colors uppercase">
              Shipping Policy
            </Link>
          </div>

          <p className="font-body text-[11px] text-background/40 tracking-[0.1em]">
            © {new Date().getFullYear()} Manchala Gadwal Sarees. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
