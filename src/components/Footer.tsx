import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Facebook, Youtube } from 'lucide-react';
import logo from '@/assets/logo.png';

export function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground/80">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <img src={logo} alt="Kavi Women's World" className="h-20 w-auto mb-4 brightness-200" loading="lazy" width={512} height={512} />
            <p className="font-body text-sm leading-relaxed text-primary-foreground/60">
              Discover the finest collection of handcrafted sarees that blend traditional artistry with contemporary grace.
            </p>
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
                <span>+91 94946 44998</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                <span className="break-all">info@kaviwomensworld.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gold mt-0.5" />
                <span>Hyderabad, Telangana, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-10 pt-6 flex flex-col items-center gap-3 text-center">
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 font-body text-xs text-primary-foreground/40">
            <Link to="#" className="hover:text-primary-foreground/70 transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-primary-foreground/70 transition-colors">Terms & Conditions</Link>
            <Link to="#" className="hover:text-primary-foreground/70 transition-colors">Shipping Policy</Link>
          </div>
          <p className="font-body text-xs text-primary-foreground/40">
            © 2024 Kavi Women's World. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
