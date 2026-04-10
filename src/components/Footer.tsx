import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Facebook, Youtube, ChevronUp } from 'lucide-react';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import logo from '@/assets/logo.png';

export function Footer() {
  const [expanded, setExpanded] = useState(false);
  const { data: settings } = useStoreSettings();

  const logoSrc = settings?.logo_url || logo;
  const description = settings?.footer_description || 'Discover the finest collection of handcrafted sarees that blend traditional artistry with contemporary grace.';
  const phone = settings?.store_phone || '+91 94946 44998';
  const email = settings?.store_email || 'info@kaviwomensworld.com';
  const address = settings?.store_address || 'Hyderabad, Telangana, India';
  const igUrl = settings?.social_instagram || 'https://instagram.com';
  const fbUrl = settings?.social_facebook || 'https://facebook.com';
  const ytUrl = settings?.social_youtube || 'https://youtube.com';

  return (
    <footer className="bg-foreground text-primary-foreground/80">
      {/* Mobile collapsed footer */}
      <div className="md:hidden">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-6 py-4 text-primary-foreground/70"
        >
          <div className="flex items-center gap-3">
            <img src={logoSrc} alt="Kavi Women's World" className="h-8 w-auto brightness-200" loading="lazy" width={512} height={512} />
            <span className="font-body text-xs text-primary-foreground/50">© {new Date().getFullYear()}</span>
          </div>
          <ChevronUp className={`h-5 w-5 transition-transform duration-300 ${expanded ? '' : 'rotate-180'}`} />
        </button>

        {expanded && (
          <div className="px-6 pb-6 space-y-6 animate-in slide-in-from-bottom-2 duration-300">
            {/* Brand */}
            <div>
              <p className="font-body text-sm leading-relaxed text-primary-foreground/60">
                {description}
              </p>
              <div className="flex gap-3 mt-3">
                <a href={igUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-primary-foreground/10 hover:bg-gold/20 hover:text-gold transition-colors">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href={fbUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-primary-foreground/10 hover:bg-gold/20 hover:text-gold transition-colors">
                  <Facebook className="h-4 w-4" />
                </a>
                <a href={ytUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-primary-foreground/10 hover:bg-gold/20 hover:text-gold transition-colors">
                  <Youtube className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Links grid */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-display text-base font-semibold text-primary-foreground mb-3">Quick Links</h4>
                <ul className="space-y-2 font-body text-sm">
                  {['Home', 'Collections', 'New Arrivals', 'About', 'Contact'].map(link => (
                    <li key={link}>
                      <Link to={link === 'Home' ? '/' : `/${link.toLowerCase().replace(' ', '-')}`} className="hover:text-gold transition-colors">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-display text-base font-semibold text-primary-foreground mb-3">Categories</h4>
                <ul className="space-y-2 font-body text-sm">
                  {['Pattu Sarees', 'Banarasi', 'Premium', 'Best Sellers', 'Offers'].map(cat => (
                    <li key={cat}>
                      <Link to={`/collections?filter=${cat.toLowerCase().replace(' ', '-')}`} className="hover:text-gold transition-colors">
                        {cat}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-display text-base font-semibold text-primary-foreground mb-3">Contact Us</h4>
              <ul className="space-y-2.5 font-body text-sm">
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gold" />
                  <span>{phone}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                  <span className="break-all">{email}</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gold mt-0.5" />
                  <span>{address}</span>
                </li>
              </ul>
            </div>

            {/* Policy links */}
            <div className="border-t border-primary-foreground/10 pt-4 flex flex-wrap justify-center gap-x-5 gap-y-1 font-body text-xs text-primary-foreground/40">
              <Link to="/privacy-policy" className="hover:text-primary-foreground/70 transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-primary-foreground/70 transition-colors">Terms & Conditions</Link>
              <Link to="/shipping-policy" className="hover:text-primary-foreground/70 transition-colors">Shipping Policy</Link>
            </div>
          </div>
        )}
      </div>

      {/* Desktop/Tablet footer — unchanged */}
      <div className="container py-12 md:py-16 hidden md:block">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <img src={logoSrc} alt="Kavi Women's World" className="h-20 w-auto mb-4 brightness-200" loading="lazy" width={512} height={512} />
            <p className="font-body text-sm leading-relaxed text-primary-foreground/60">
              {description}
            </p>
            <div className="flex gap-3 mt-4">
              <a href={igUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-primary-foreground/10 hover:bg-gold/20 hover:text-gold transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href={fbUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-primary-foreground/10 hover:bg-gold/20 hover:text-gold transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href={ytUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-primary-foreground/10 hover:bg-gold/20 hover:text-gold transition-colors">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold text-primary-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2 font-body text-sm">
              {['Home', 'Collections', 'New Arrivals', 'About', 'Contact'].map(link => (
                <li key={link}>
                  <Link to={link === 'Home' ? '/' : `/${link.toLowerCase().replace(' ', '-')}`} className="hover:text-gold transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display text-lg font-semibold text-primary-foreground mb-4">Categories</h4>
            <ul className="space-y-2 font-body text-sm">
              {['Pattu Sarees', 'Banarasi', 'Premium', 'Best Sellers', 'Offers'].map(cat => (
                <li key={cat}>
                  <Link to={`/collections?filter=${cat.toLowerCase().replace(' ', '-')}`} className="hover:text-gold transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold text-primary-foreground mb-4">Contact Us</h4>
            <ul className="space-y-3 font-body text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gold" />
                <span>{phone}</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                <span className="break-all">{email}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gold mt-0.5" />
                <span>{address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-10 pt-6 flex flex-col items-center gap-3 text-center">
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 font-body text-xs text-primary-foreground/40">
            <Link to="/privacy-policy" className="hover:text-primary-foreground/70 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary-foreground/70 transition-colors">Terms & Conditions</Link>
            <Link to="/shipping-policy" className="hover:text-primary-foreground/70 transition-colors">Shipping Policy</Link>
          </div>
          <p className="font-body text-xs text-primary-foreground/40">
            © {new Date().getFullYear()} Kavi Women's World. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
