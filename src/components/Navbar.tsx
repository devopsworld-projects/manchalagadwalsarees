import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X, ChevronDown, Phone, Heart, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { SearchOverlay } from '@/components/SearchOverlay';
import logo from '@/assets/logo.png';

const silkItems = [
  { label: 'Kanjivaram Sarees', slug: 'kanjivaram-sarees' },
  { label: 'Banarasi Sarees', slug: 'banarasi-sarees' },
  { label: 'Soft Silk Sarees', slug: 'soft-silk-sarees' },
  { label: 'Mysore Silk Sarees', slug: 'mysore-silk-sarees' },
  { label: 'Raw Silk Sarees', slug: 'raw-silk-sarees' },
  { label: 'Maheshwari Silk', slug: 'maheshwari-silk-sarees' },
  { label: 'Kalamkari Sarees', slug: 'kalamkari-sarees' },
  { label: 'Madhubani Print Sarees', slug: 'madhubani-sarees' },
];

const cottonItems = [
  { label: 'Bengali Cotton Sarees', slug: 'bengali-cotton-sarees' },
  { label: 'Jaipur Cotton Sarees', slug: 'jaipur-cotton-sarees' },
  { label: 'South Cotton Sarees', slug: 'south-cotton-sarees' },
  { label: 'Block Print Sarees', slug: 'block-print-sarees' },
  { label: 'Bagru Print Sarees', slug: 'bagru-print-sarees' },
  { label: 'Ajrakh Print Sarees', slug: 'ajrakh-print-sarees' },
  { label: 'Ikkat Sarees', slug: 'ikkat-sarees' },
  { label: 'Chanderi Cotton Silk', slug: 'chanderi-cotton-silk' },
];

const regionalItems = [
  { label: 'Sambalpuri Sarees', slug: 'sambalpuri-sarees' },
  { label: 'Karnataka Sarees', slug: 'karnataka-sarees' },
  { label: 'Tamil Nadu Sarees', slug: 'tamilnadu-sarees' },
  { label: 'Maheshwari Sarees', slug: 'maheshwari-silk-sarees' },
];

const specialtyItems = [
  { label: 'Linen Sarees', slug: 'linen-sarees' },
  { label: 'Georgette Sarees', slug: 'georgette-sarees' },
  { label: 'Chiffon Sarees', slug: 'chiffon-sarees' },
  { label: 'Wedding Collection', slug: 'wedding-sarees' },
  { label: 'Office Wear', slug: 'office-wear-sarees' },
];

type DropdownMenu = {
  label: string;
  items: { label: string; slug: string }[];
  viewAllSlug?: string;
};

const dropdownMenus: DropdownMenu[] = [
  { label: 'SILK', items: silkItems, viewAllSlug: 'pure-silk' },
  { label: 'COTTON', items: cottonItems, viewAllSlug: 'cotton' },
  { label: 'REGIONAL', items: regionalItems },
  { label: 'SPECIALTY', items: specialtyItems },
];

const topLinks = [
  { label: 'About Us', path: '/about' },
  { label: 'Contact Us', path: '/contact' },
];

function DropdownNavItem({ menu, isOpen, onToggle, onClose }: {
  menu: DropdownMenu;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <div ref={ref} className="relative group">
      <button
        onClick={onToggle}
        onMouseEnter={onToggle}
        className="flex items-center gap-1 text-xs tracking-[0.2em] font-body font-normal text-foreground/80 hover:text-foreground transition-colors py-2"
      >
        {menu.label}
        <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 bg-background border border-border shadow-lg rounded-sm min-w-[220px] py-3 z-50"
          onMouseLeave={onClose}
        >
          {menu.items.map(item => (
            <Link
              key={item.slug}
              to={`/collections?filter=${item.slug}`}
              onClick={onClose}
              className="block px-5 py-2 text-xs tracking-[0.08em] font-body text-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
            >
              {item.label}
            </Link>
          ))}
          {menu.viewAllSlug && (
            <>
              <div className="border-t border-border mx-4 my-2" />
              <Link
                to={`/collections?filter=${menu.viewAllSlug}`}
                onClick={onClose}
                className="block px-5 py-2 text-xs tracking-[0.12em] font-body font-bold text-primary hover:text-primary/80 transition-colors"
              >
                VIEW ALL {menu.label} →
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const { user } = useAuth();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50">
      {/* Top utility bar */}
      <div className="bg-foreground text-background hidden md:block">
        <div className="container flex items-center justify-between h-9">
          <nav className="flex items-center gap-5">
            {topLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className="text-[11px] tracking-[0.1em] font-body text-background/80 hover:text-background transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/919494644998"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] tracking-[0.05em] font-body text-background/80 hover:text-background transition-colors"
            >
              <Phone className="h-3 w-3" />
              +91 94946 44998
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
        <div className="container flex items-center justify-between h-16 md:h-20">
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Kavi Women's World" className="h-14 md:h-18 w-auto" />
          </Link>

          {/* Desktop nav with dropdowns */}
          <nav className="hidden md:flex items-center gap-7">
            {dropdownMenus.map(menu => (
              <DropdownNavItem
                key={menu.label}
                menu={menu}
                isOpen={openDropdown === menu.label}
                onToggle={() => setOpenDropdown(openDropdown === menu.label ? null : menu.label)}
                onClose={() => setOpenDropdown(null)}
              />
            ))}
            <Link
              to="/collections"
              className="text-xs tracking-[0.2em] font-body font-normal text-foreground/80 hover:text-foreground transition-colors py-2"
            >
              ALL COLLECTIONS
            </Link>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <button className="p-2 hover:text-primary transition-colors" aria-label="Search" onClick={() => setSearchOpen(true)}>
              <Search className="h-5 w-5" />
            </button>
            <button
              className="p-2 hover:text-primary transition-colors relative"
              onClick={() => setIsCartOpen(true)}
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="md:hidden border-b border-border bg-background px-4 py-4 space-y-1 max-h-[70vh] overflow-y-auto">
          {dropdownMenus.map(menu => (
            <div key={menu.label}>
              <button
                onClick={() => setMobileExpanded(mobileExpanded === menu.label ? null : menu.label)}
                className="flex items-center justify-between w-full py-2.5 text-sm tracking-[0.12em] font-body text-foreground/80"
              >
                {menu.label}
                <ChevronDown className={`h-4 w-4 transition-transform ${mobileExpanded === menu.label ? 'rotate-180' : ''}`} />
              </button>
              {mobileExpanded === menu.label && (
                <div className="pl-4 pb-2 space-y-0.5">
                  {menu.items.map(item => (
                    <Link
                      key={item.slug}
                      to={`/collections?filter=${item.slug}`}
                      onClick={() => { setMobileOpen(false); setMobileExpanded(null); }}
                      className="block py-2 text-xs tracking-[0.08em] font-body text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="border-t border-border pt-2 mt-2 space-y-1">
            <Link
              to="/collections"
              onClick={() => setMobileOpen(false)}
              className="block py-2.5 text-sm tracking-[0.12em] font-body text-foreground/80 hover:text-foreground"
            >
              ALL COLLECTIONS
            </Link>
            {topLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className="block py-2.5 text-sm tracking-[0.12em] font-body text-foreground/80 hover:text-foreground"
              >
                {link.label.toUpperCase()}
              </Link>
            ))}
          </div>
        </nav>
      )}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
