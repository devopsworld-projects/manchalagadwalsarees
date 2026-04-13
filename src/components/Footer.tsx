import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Facebook, Youtube, ChevronUp } from 'lucide-react';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import { useMenuItems } from '@/hooks/useMenuItems';
import logo from '@/assets/logo.png';

function getItemUrl(item: { slug: string | null; url: string | null }) {
  if (item.url) return item.url;
  if (item.slug) return `/collections?filter=${item.slug}`;
  return '/collections';
}

export function Footer() {
  const [expanded, setExpanded] = useState(false);
  const { data: settings } = useStoreSettings();
  const { data: footerMenuItems = [] } = useMenuItems('footer');

  const logoSrc = settings?.logo_url || logo;
  const description = settings?.footer_description || 'Discover the finest collection of handcrafted sarees that blend traditional artistry with contemporary grace.';
  const phone = settings?.store_phone || '+91 94946 44998';
  const email = settings?.store_email || 'info@kaviwomensworld.com';
  const address = settings?.store_address || 'Hyderabad, Telangana, India';
  const igUrl = settings?.social_instagram || 'https://instagram.com';
  const fbUrl = settings?.social_facebook || 'https://facebook.com';
  const ytUrl = settings?.social_youtube || 'https://youtube.com';

  const renderFooterLinks = (isMobile = false) => {
    if (footerMenuItems.length > 0) {
      return footerMenuItems.map(group => (
        <div key={group.id}>
          <h4 className={`font-display ${isMobile ? 'text-sm' : 'text-base'} font-bold text-background tracking-[0.15em] uppercase ${isMobile ? 'mb-3' : 'mb-5'}`}>
            {group.label}
          </h4>
          <ul className="space-y-2.5 font-body text-sm">
            {(group.children || []).map(child => (
              <li key={child.id}>
                <Link to={getItemUrl(child)} className="text-background/50 hover:text-accent transition-colors tracking-wide">
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
          <h4 className={`font-display ${isMobile ? 'text-sm' : 'text-base'} font-bold text-background tracking-[0.15em] uppercase ${isMobile ? 'mb-3' : 'mb-5'}`}>Quick Links</h4>
          <ul className="space-y-2.5 font-body text-sm">
            {['Home', 'Collections', 'New Arrivals', 'About', 'Contact'].map(link => (
              <li key={link}>
                <Link to={link === 'Home' ? '/' : `/${link.toLowerCase().replace(' ', '-')}`} className="text-background/50 hover:text-accent transition-colors tracking-wide">
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className={`font-display ${isMobile ? 'text-sm' : 'text-base'} font-bold text-background tracking-[0.15em] uppercase ${isMobile ? 'mb-3' : 'mb-5'}`}>Categories</h4>
          <ul className="space-y-2.5 font-body text-sm">
            {['Pattu Sarees', 'Banarasi', 'Premium', 'Best Sellers', 'Offers'].map(cat => (
              <li key={cat}>
                <Link to={`/collections?filter=${cat.toLowerCase().replace(' ', '-')}`} className="text-background/50 hover:text-accent transition-colors tracking-wide">
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </>
    );
  };

  const socialIcons = (
    <div className="flex gap-3 mt-4">
      {[
        { url: igUrl, Icon: Instagram },
        { url: fbUrl, Icon: Facebook },
        { url: ytUrl, Icon: Youtube },
      ].map(({ url, Icon }) => (
        <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="p-2.5 border border-background/10 hover:border-accent/50 hover:text-accent transition-all">
          <Icon className="h-4 w-4" />
        </a>
      ))}
    </div>
  );

  const contactSection = (isMobile = false) => (
    <div>
      <h4 className={`font-display ${isMobile ? 'text-sm' : 'text-base'} font-bold text-background tracking-[0.15em] uppercase ${isMobile ? 'mb-3' : 'mb-5'}`}>Contact Us</h4>
      <ul className={`space-y-3 font-body text-sm`}>
        <li className="flex items-center gap-3 text-background/50">
          <Phone className="h-4 w-4 text-accent shrink-0" />
          <span>{phone}</span>
        </li>
        <li className="flex items-start gap-3 text-background/50">
          <Mail className="h-4 w-4 text-accent shrink-0 mt-0.5" />
          <span className="break-all">{email}</span>
        </li>
        <li className="flex items-start gap-3 text-background/50">
          <MapPin className="h-4 w-4 text-accent shrink-0 mt-0.5" />
          <span>{address}</span>
        </li>
      </ul>
    </div>
  );

  const policyLinks = (
    <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 font-body text-[10px] text-background/30 tracking-wider uppercase">
      <Link to="/privacy-policy" className="hover:text-accent transition-colors">Privacy Policy</Link>
      <Link to="/terms" className="hover:text-accent transition-colors">Terms & Conditions</Link>
      <Link to="/shipping-policy" className="hover:text-accent transition-colors">Shipping Policy</Link>
    </div>
  );

  return (
    <footer className="hidden md:block bg-foreground text-background/60 relative">
      {/* Top ornate gold border */}
      <div className="ornate-line" />

      {/* Mobile collapsed footer */}
      <div className="md:hidden">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-6 py-4 text-background/70"
        >
          <div className="flex items-center gap-3">
            <img src={logoSrc} alt="Kavi Women's World" className="h-8 w-auto brightness-200" loading="lazy" width={512} height={512} />
            <span className="font-body text-xs text-background/30">© {new Date().getFullYear()}</span>
          </div>
          <ChevronUp className={`h-5 w-5 transition-transform duration-300 ${expanded ? '' : 'rotate-180'}`} />
        </button>

        {expanded && (
          <div className="px-6 pb-6 space-y-6 animate-in slide-in-from-bottom-2 duration-300">
            <div>
              <p className="font-serif text-sm leading-relaxed text-background/40 italic">{description}</p>
              {socialIcons}
            </div>
            <div className="grid grid-cols-2 gap-6">
              {renderFooterLinks(true)}
            </div>
            {contactSection(true)}
            <div className="ornate-line" />
            <div className="pt-3">
              {policyLinks}
            </div>
          </div>
        )}
      </div>

      {/* Desktop footer */}
      <div className="container py-14 md:py-20 hidden md:block">
        <div className={`grid md:grid-cols-${Math.min(footerMenuItems.length + 2, 4)} gap-10`}>
          <div>
            <img src={logoSrc} alt="Kavi Women's World" className="h-20 w-auto mb-5 brightness-200" loading="lazy" width={512} height={512} />
            <p className="font-serif text-sm leading-relaxed text-background/40 italic">{description}</p>
            {socialIcons}
          </div>
          {renderFooterLinks(false)}
          {contactSection(false)}
        </div>

        <div className="mt-12 pt-6 flex flex-col items-center gap-4 text-center">
          <div className="ornate-line w-full" />
          <div className="pt-4">
            {policyLinks}
          </div>
          <p className="font-body text-[10px] text-background/25 tracking-[0.15em]">
            © {new Date().getFullYear()} Kavi Women's World. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
