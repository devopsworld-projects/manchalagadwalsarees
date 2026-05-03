import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Facebook, Youtube, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import { useMenuItems } from '@/hooks/useMenuItems';
import { cn } from '@/lib/utils';
import logo from '@/assets/logo.png';

function getItemUrl(item: { slug: string | null; url: string | null }) {
  if (item.url) return item.url;
  if (item.slug) return `/collections?filter=${item.slug}`;
  return '/collections';
}

function FooterColumn({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="md:block border-b border-background/10 md:border-0 py-3 md:py-0">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="md:pointer-events-none flex w-full items-center justify-between md:block min-h-[44px] md:min-h-0"
        aria-expanded={open}
      >
        <h4 className="font-display text-[11px] font-bold text-background tracking-[0.25em] uppercase md:mb-6 relative md:inline-block">
          {title}
          <span className="hidden md:block absolute -bottom-2 left-0 w-8 h-px bg-gradient-to-r from-accent to-transparent" />
        </h4>
        <ChevronDown className={cn('h-4 w-4 text-background/50 md:hidden transition-transform', open && 'rotate-180')} />
      </button>
      <div className={cn('md:!block overflow-hidden transition-all', open ? 'max-h-[500px] mt-3' : 'max-h-0 md:max-h-none')}>
        {children}
      </div>
    </div>
  );
}

export function Footer() {
  const { data: settings } = useStoreSettings();
  const { data: footerMenuItems = [] } = useMenuItems('footer');

  const logoSrc = settings?.logo_url || logo;
  const description = settings?.footer_description || 'Discover the finest collection of handcrafted sarees that blend traditional artistry with contemporary grace.';
  const phone = settings?.store_phone || '+91 98858 79188';
  const whatsappNumber = settings?.whatsapp_number || '919885879188';
  const storeEmail = settings?.store_email || 'info@manchalagadwalsarees.com';
  const address = settings?.store_address || 'Hyderabad, Telangana, India';
  const igUrl = settings?.social_instagram || 'https://instagram.com';
  const fbUrl = settings?.social_facebook || 'https://facebook.com';
  const ytUrl = settings?.social_youtube || 'https://youtube.com';

  const linkClass = 'group/link flex items-center gap-2 text-sm font-body text-background/65 hover:text-accent transition-colors tracking-wide min-h-[40px] md:min-h-0';

  const renderFooterLinks = () => {
    if (footerMenuItems.length > 0) {
      return footerMenuItems.map(group => (
        <FooterColumn key={group.id} title={group.label}>
          <ul className="space-y-1 md:space-y-3">
            {(group.children || []).map(child => (
              <li key={child.id}>
                <Link to={getItemUrl(child)} className={linkClass}>
                  <span className="w-0 group-hover/link:w-3 h-px bg-accent transition-all duration-300" />
                  {child.label}
                </Link>
              </li>
            ))}
          </ul>
        </FooterColumn>
      ));
    }

    return (
      <>
        <FooterColumn title="Quick Links">
          <ul className="space-y-1 md:space-y-3">
            {['Home', 'Collections', 'New Arrivals', 'About', 'Contact'].map(link => (
              <li key={link}>
                <Link to={link === 'Home' ? '/' : `/${link.toLowerCase().replace(' ', '-')}`} className={linkClass}>
                  <span className="w-0 group-hover/link:w-3 h-px bg-accent transition-all duration-300" />
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </FooterColumn>
        <FooterColumn title="Categories">
          <ul className="space-y-1 md:space-y-3">
            {['Pattu Sarees', 'Banarasi', 'Premium', 'Best Sellers', 'Offers'].map(cat => (
              <li key={cat}>
                <Link to={`/collections?filter=${cat.toLowerCase().replace(' ', '-')}`} className={linkClass}>
                  <span className="w-0 group-hover/link:w-3 h-px bg-accent transition-all duration-300" />
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </FooterColumn>
      </>
    );
  };

  return (
    <footer className="relative bg-foreground text-background/60 overflow-hidden">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-accent/60 to-transparent" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: 'radial-gradient(circle at 20% 0%, hsl(var(--accent)) 0%, transparent 40%), radial-gradient(circle at 80% 100%, hsl(var(--accent)) 0%, transparent 40%)',
      }} />

      <div className="relative container py-10 md:py-20">
        {/* Brand block */}
        <div className="md:grid md:grid-cols-4 md:gap-12">
          <div className="text-center md:text-left mb-8 md:mb-0">
            <img src={logoSrc} alt="Manchala Gadwal Sarees" className="h-20 w-auto mb-5 brightness-200 mx-auto md:mx-0" loading="lazy" width={512} height={512} />
            <p className="font-serif text-sm leading-relaxed text-background/65 italic mb-6 max-w-xs mx-auto md:mx-0">
              {description}
            </p>

            <div className="flex gap-2.5 justify-center md:justify-start">
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
                  className="w-11 h-11 border border-background/20 flex items-center justify-center text-background/70 hover:border-accent hover:text-accent active:bg-accent/15 hover:bg-accent/10 transition-all duration-300"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns - accordion on mobile */}
          <div className="md:contents">
            {renderFooterLinks()}

            <FooterColumn title="Contact Us">
              <ul className="space-y-3 md:space-y-4">
                <li>
                  <a href={`tel:${phone.replace(/\s/g, '')}`} className="group/c flex items-center gap-3 text-sm font-body text-background/70 hover:text-accent transition-colors min-h-[44px]">
                    <span className="w-9 h-9 border border-accent/25 flex items-center justify-center shrink-0">
                      <Phone className="h-3.5 w-3.5 text-accent" />
                    </span>
                    {phone}
                  </a>
                </li>
                <li>
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=Hi%2C%20I%27m%20interested%20in%20your%20sarees!`}
                    target="_blank" rel="noopener noreferrer"
                    className="group/c flex items-center gap-3 text-sm font-body text-background/70 hover:text-[#25D366] transition-colors min-h-[44px]"
                  >
                    <span className="w-9 h-9 border border-accent/25 flex items-center justify-center shrink-0">
                      <WhatsAppIcon className="h-3.5 w-3.5 text-[#25D366]" />
                    </span>
                    Chat on WhatsApp
                  </a>
                </li>
                <li>
                  <a href={`mailto:${storeEmail}`} className="group/c flex items-start gap-3 text-sm font-body text-background/70 hover:text-accent transition-colors min-h-[44px]">
                    <span className="w-9 h-9 border border-accent/25 flex items-center justify-center shrink-0">
                      <Mail className="h-3.5 w-3.5 text-accent" />
                    </span>
                    <span className="break-all pt-2">{storeEmail}</span>
                  </a>
                </li>
                <li className="flex items-start gap-3 text-sm font-body text-background/70 min-h-[44px]">
                  <span className="w-9 h-9 border border-accent/25 flex items-center justify-center shrink-0">
                    <MapPin className="h-3.5 w-3.5 text-accent" />
                  </span>
                  <span className="pt-2">{address}</span>
                </li>
              </ul>
            </FooterColumn>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-10 md:mt-14 pt-8 md:pt-10 border-t border-background/10 grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6 text-center">
          {[
            { title: 'Authentic', sub: 'Handwoven Sarees' },
            { title: 'Free Shipping', sub: 'Across India' },
            { title: 'Easy Returns', sub: '7-Day Policy' },
            { title: 'Secure Payments', sub: 'Trusted Gateway' },
          ].map(item => (
            <div key={item.title} className="group/badge">
              <p className="font-display text-[10px] md:text-[11px] tracking-[0.2em] md:tracking-[0.25em] text-accent uppercase mb-1.5">
                {item.title}
              </p>
              <p className="font-serif text-xs italic text-background/55">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative border-t border-background/10 bg-background/[0.02]">
        <div className="container py-5 md:py-6 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
          <div className="flex flex-wrap justify-center md:justify-start gap-x-5 gap-y-2">
            <Link to="/privacy-policy" className="text-[10px] font-display tracking-[0.2em] text-background/55 hover:text-accent transition-colors uppercase min-h-[32px] flex items-center">
              Privacy
            </Link>
            <Link to="/terms" className="text-[10px] font-display tracking-[0.2em] text-background/55 hover:text-accent transition-colors uppercase min-h-[32px] flex items-center">
              Terms
            </Link>
            <Link to="/shipping-policy" className="text-[10px] font-display tracking-[0.2em] text-background/55 hover:text-accent transition-colors uppercase min-h-[32px] flex items-center">
              Shipping
            </Link>
          </div>

          <p className="font-body text-[10.5px] md:text-[11px] text-background/45 tracking-[0.1em] text-center">
            © {new Date().getFullYear()} Manchala Gadwal Sarees · <span className="text-accent/70">Crafted with devotion</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
