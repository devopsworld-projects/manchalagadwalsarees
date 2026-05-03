import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Facebook, Youtube } from 'lucide-react';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';
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
  const description = settings?.footer_description || 'Handwoven heritage from the looms of Telangana — pure zari, temple borders, and timeless grace.';
  const phone = settings?.store_phone || '+91 98858 79188';
  const whatsappNumber = settings?.whatsapp_number || '919885879188';
  const email = settings?.store_email || 'info@manchalagadwalsarees.com';
  const address = settings?.store_address || 'Hyderabad, Telangana, India';
  const igUrl = settings?.social_instagram || 'https://instagram.com';
  const fbUrl = settings?.social_facebook || 'https://facebook.com';
  const ytUrl = settings?.social_youtube || 'https://youtube.com';

  const renderFooterLinks = () => {
    if (footerMenuItems.length > 0) {
      return footerMenuItems.map(group => (
        <div key={group.id}>
          <h4 className="font-display text-[10px] tracking-luxe uppercase text-accent mb-7">
            {group.label}
          </h4>
          <ul className="space-y-4">
            {(group.children || []).map(child => (
              <li key={child.id}>
                <Link to={getItemUrl(child)} className="link-luxe font-serif italic text-base text-background/70 hover:text-accent transition-colors">
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
          <h4 className="font-display text-[10px] tracking-luxe uppercase text-accent mb-7">Atelier</h4>
          <ul className="space-y-4">
            {[['Home','/'],['Collections','/collections'],['New Arrivals','/collections?filter=new-arrivals'],['Our Heritage','/about'],['Contact','/contact']].map(([l,h]) => (
              <li key={l}><Link to={h} className="link-luxe font-serif italic text-base text-background/70 hover:text-accent">{l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-display text-[10px] tracking-luxe uppercase text-accent mb-7">Discover</h4>
          <ul className="space-y-4">
            {[['Pattu','pattu-sarees'],['Banarasi','banarasi-sarees'],['Kanjivaram','kanjivaram-sarees'],['Bridal','bridal'],['Bestsellers','best-sellers']].map(([l,s]) => (
              <li key={l}><Link to={`/collections?filter=${s}`} className="link-luxe font-serif italic text-base text-background/70 hover:text-accent">{l}</Link></li>
            ))}
          </ul>
        </div>
      </>
    );
  };

  return (
    <footer className="bg-foreground text-background relative overflow-hidden">
      {/* Massive editorial wordmark band */}
      <div className="border-b border-background/10 py-12 md:py-20">
        <div className="container">
          <p className="font-display italic text-[15vw] md:text-[12vw] leading-[0.85] text-accent/15 select-none tracking-tighter">
            manchala
          </p>
          <p className="font-display italic text-[15vw] md:text-[12vw] leading-[0.85] text-background/95 select-none tracking-tighter mt-2 md:mt-4">
            sarees<span className="text-accent">.</span>
          </p>
        </div>
      </div>

      {/* Main grid */}
      <div className="container py-20 md:py-24">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10 md:gap-12">
          <div className="col-span-2 md:col-span-4">
            <img src={logoSrc} alt="Manchala Gadwal Sarees" className="h-16 w-auto mb-6 brightness-200" loading="lazy" width={512} height={512} />
            <p className="font-serif text-base text-background/65 italic leading-relaxed mb-8 max-w-sm">
              {description}
            </p>
            <div className="flex gap-3">
              {[
                { url: igUrl, Icon: Instagram, label: 'Instagram' },
                { url: fbUrl, Icon: Facebook, label: 'Facebook' },
                { url: ytUrl, Icon: Youtube, label: 'YouTube' },
              ].map(({ url, Icon, label }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-11 h-11 border border-background/25 flex items-center justify-center text-background/70 hover:bg-accent hover:border-accent hover:text-accent-foreground transition-all duration-500"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-5 grid grid-cols-2 gap-10">
            {renderFooterLinks()}
          </div>

          <div className="col-span-2 md:col-span-3">
            <h4 className="font-display text-[10px] tracking-luxe uppercase text-accent mb-7">Connect</h4>
            <ul className="space-y-5">
              <li>
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-start gap-3 text-base font-serif italic text-background/75 hover:text-accent transition-colors">
                  <Phone className="h-4 w-4 mt-1.5 text-accent shrink-0" />
                  <span>{phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=Hi%2C%20I%27m%20interested%20in%20your%20sarees!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-base font-serif italic text-background/75 hover:text-[#25D366] transition-colors"
                >
                  <WhatsAppIcon className="h-4 w-4 mt-1.5 text-[#25D366] shrink-0" />
                  <span>Chat on WhatsApp</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="flex items-start gap-3 text-base font-serif italic text-background/75 hover:text-accent transition-colors break-all">
                  <Mail className="h-4 w-4 mt-1.5 text-accent shrink-0" />
                  <span>{email}</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-base font-serif italic text-background/75">
                <MapPin className="h-4 w-4 mt-1.5 text-accent shrink-0" />
                <span>{address}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-background/10">
        <div className="container py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-2">
            <Link to="/privacy-policy" className="link-luxe text-[10px] font-display tracking-luxe text-background/55 hover:text-accent uppercase">Privacy</Link>
            <Link to="/terms" className="link-luxe text-[10px] font-display tracking-luxe text-background/55 hover:text-accent uppercase">Terms</Link>
            <Link to="/shipping-policy" className="link-luxe text-[10px] font-display tracking-luxe text-background/55 hover:text-accent uppercase">Shipping</Link>
          </div>
          <p className="font-body text-[10px] tracking-refined text-background/40 uppercase">
            © {new Date().getFullYear()} Manchala Gadwal Sarees · All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
