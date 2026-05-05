import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X, ChevronDown, Phone, Heart, User, LogOut, Package } from 'lucide-react';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { SearchOverlay } from '@/components/SearchOverlay';
import { CurrencySelector } from '@/components/CurrencySelector';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import { useMenuItems, type MenuItem } from '@/hooks/useMenuItems';
import logo from '@/assets/logo.png';

function getItemUrl(item: MenuItem) {
  if (item.url) return item.url;
  if (item.slug) return `/collections?filter=${item.slug}`;
  return '/collections';
}

function isUrlActive(url: string, pathname: string, search: string): boolean {
  if (!url) return false;
  const [path, query] = url.split('?');
  if (query) {
    if (pathname !== path) return false;
    const target = new URLSearchParams(query);
    const current = new URLSearchParams(search);
    for (const [k, v] of target.entries()) {
      if (current.get(k) !== v) return false;
    }
    return true;
  }
  if (path === '/') return pathname === '/';
  // Avoid marking parent active when a filtered child is selected
  if (path === '/collections' && new URLSearchParams(search).get('filter')) return false;
  return pathname === path || pathname.startsWith(path + '/');
}

function isItemActive(item: MenuItem, pathname: string, search: string): boolean {
  if (isUrlActive(getItemUrl(item), pathname, search)) return true;
  return (item.children || []).some(c => isUrlActive(getItemUrl(c), pathname, search));
}

function MegaNavItem({ item, isOpen, onOpen, onClose, isActive }: {
  item: MenuItem;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  isActive: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const children = item.children || [];
  const hasChildren = children.length > 0;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!hasChildren) {
    return (
      <Link
        to={getItemUrl(item)}
        aria-current={isActive ? 'page' : undefined}
        className={`relative text-[13px] tracking-[0.02em] font-body font-semibold ${isActive ? 'text-accent' : 'text-primary/90'} hover:text-accent active:text-accent transition-colors py-2 capitalize after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-[2px] after:bg-accent after:transition-transform after:duration-300 ${isActive ? 'after:scale-x-100' : 'after:scale-x-0'} after:origin-center hover:after:scale-x-100`}
      >
        {item.label}
      </Link>
    );
  }

  // Determine column count: 4 cols if >12, 3 cols if >6, else 2 cols
  const colCount = children.length > 12 ? 4 : children.length > 6 ? 3 : 2;
  const widthClass =
    colCount === 4 ? 'w-[820px]' : colCount === 3 ? 'w-[640px]' : 'w-[440px]';
  const gridClass =
    colCount === 4 ? 'grid-cols-4' : colCount === 3 ? 'grid-cols-3' : 'grid-cols-2';

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
    >
      <button
        onClick={onOpen}
        className={`relative flex items-center gap-1 text-[13px] tracking-[0.02em] font-body font-semibold ${isActive ? 'text-accent' : 'text-primary/90'} hover:text-accent active:text-accent transition-colors py-2 capitalize after:content-[''] after:absolute after:left-0 after:right-4 after:-bottom-0.5 after:h-[2px] after:bg-accent after:transition-transform after:duration-300 ${isActive ? 'after:scale-x-100' : 'after:scale-x-0'} after:origin-center hover:after:scale-x-100`}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-current={isActive ? 'page' : undefined}
      >
        {item.label}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className={`absolute top-full left-1/2 -translate-x-1/2 bg-background border border-border/70 shadow-2xl ${widthClass} max-w-[92vw] z-50`}
          role="menu"
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent/40 via-accent to-accent/40" />
          <div className="p-6">
            {/* Heading */}
            <div className="mb-4 pb-3 border-b border-border/60">
              <h3 className="font-display text-[15px] tracking-[0.15em] uppercase text-primary">
                {item.label}
              </h3>
              <p className="font-body text-[11px] text-muted-foreground tracking-wide mt-1">
                Explore our handpicked {item.label.toLowerCase()} collection
              </p>
            </div>

            {/* Columns */}
            <div className={`grid ${gridClass} gap-x-6 gap-y-1.5`}>
              {children.map(child => {
                const childActive = isUrlActive(getItemUrl(child), location.pathname, location.search);
                return (
                  <Link
                    key={child.id}
                    to={getItemUrl(child)}
                    onClick={onClose}
                    role="menuitem"
                    aria-current={childActive ? 'page' : undefined}
                    className={`group flex items-center text-[13px] font-body ${childActive ? 'text-accent font-semibold' : 'text-primary/85'} hover:text-accent transition-colors py-1.5 capitalize`}
                  >
                    <span className={`w-1.5 h-1.5 ${childActive ? 'bg-accent' : 'bg-accent/0'} group-hover:bg-accent transition-colors mr-2 rounded-full`} />
                    {child.label}
                  </Link>
                );
              })}
            </div>

            {/* View all */}
            {item.slug && (
              <div className="mt-5 pt-4 border-t border-border/60">
                <Link
                  to={`/collections?filter=${item.slug}`}
                  onClick={onClose}
                  className="inline-flex items-center gap-1 text-[11px] tracking-[0.2em] font-display font-bold text-accent hover:text-primary transition-colors uppercase"
                >
                  View All {item.label} →
                </Link>
              </div>
            )}
          </div>
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
  const { user, signOut } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { data: settings } = useStoreSettings();
  const { data: menuItems = [] } = useMenuItems();
  const { data: mobileMenuItems = [] } = useMenuItems('mobile');
  const { data: topBarItems = [] } = useMenuItems('topbar');
  const logoSrc = settings?.logo_url || logo;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    }
    if (userMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

  return (
    <header className="sticky top-0 z-50">
      {/* ─── Top Utility Bar ─── */}
      <div className="bg-foreground text-background hidden md:block">
        <div className="container flex items-center justify-between h-9">
          <div className="flex items-center gap-5">
            <nav className="flex items-center gap-7">
              {topBarItems.map(item => {
                const active = isUrlActive(getItemUrl(item), location.pathname, location.search);
                return (
                  <Link
                    key={item.id}
                    to={getItemUrl(item)}
                    aria-current={active ? 'page' : undefined}
                    className={`text-[10px] tracking-luxe font-display font-medium ${active ? 'text-accent' : 'text-background/80'} hover:text-accent active:text-accent transition-colors duration-500 uppercase`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-7">
            <a
              href="tel:+919885879188"
              className="flex items-center gap-2 text-[10px] tracking-refined font-body font-normal text-background/65 hover:text-accent transition-colors duration-500"
            >
              <Phone className="h-3 w-3 text-accent/80" />
              +91 98858 79188
            </a>
            <a
              href={`https://wa.me/${settings?.whatsapp_number || '919885879188'}?text=Hi%2C%20I%27m%20interested%20in%20your%20sarees!`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[10px] tracking-refined font-body font-normal text-background/65 hover:text-[#25D366] transition-colors duration-500"
              aria-label="Chat on WhatsApp"
            >
              <WhatsAppIcon className="h-3.5 w-3.5 text-[#25D366]" />
              WhatsApp
            </a>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      </div>

      {/* ─── Main Navigation ─── */}
      <div className="bg-background backdrop-blur-md border-b-2 border-accent/20 relative shadow-md">
        <div className="container flex items-center justify-between gap-4 py-4 md:py-5">
          {/* Mobile: menu button + currency on the left */}
          <div className="flex items-center gap-1 md:hidden">
            <button
              className="p-2 text-primary hover:text-accent transition-colors min-h-[44px] min-w-[44px]"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <span aria-hidden="true" className="h-4 w-px bg-border/80" />
            <div data-testid="currency-mobile" className="flex items-center">
              <CurrencySelector />
            </div>
          </div>

          {/* Desktop: split nav with centered wordmark */}
          <nav className="hidden md:flex flex-1 items-center justify-end gap-6">
            <div data-testid="currency-desktop" className="flex items-center">
              <CurrencySelector />
            </div>
            <span aria-hidden="true" className="h-4 w-px bg-border/80" />
            {menuItems.slice(0, Math.ceil(menuItems.length / 2)).map(item => (
              <MegaNavItem
                key={item.id}
                item={item}
                isOpen={openDropdown === item.id}
                onOpen={() => setOpenDropdown(item.id)}
                onClose={() => setOpenDropdown(null)}
                isActive={isItemActive(item, location.pathname, location.search)}
              />
            ))}
          </nav>

          {/* Wordmark logo (Kankatala-style) */}
          <Link to="/" className="flex flex-col items-center shrink-0 px-2 md:px-6 group">
            {/* Mobile shows image logo */}
            <img 
              src={logoSrc} 
              alt="Manchala Gadwal Sarees" 
              className="h-16 sm:h-20 w-auto md:hidden brightness-110 drop-shadow-[0_0_10px_rgba(212,175,55,0.2)]" 
            />
            {/* Desktop shows serif wordmark */}
            <span className="hidden md:block font-display text-3xl lg:text-[34px] font-bold tracking-[0.08em] text-primary leading-none">
              MANCHALA
            </span>
            <span className="hidden md:flex items-center gap-2 mt-1.5">
              <span className="h-px w-6 bg-accent/60" />
              <span className="font-body text-[9px] tracking-[0.4em] text-accent uppercase">Gadwal Sarees</span>
              <span className="h-px w-6 bg-accent/60" />
            </span>
          </Link>

          <nav className="hidden md:flex flex-1 items-center justify-start gap-7">
            {menuItems.slice(Math.ceil(menuItems.length / 2)).map(item => (
              <MegaNavItem
                key={item.id}
                item={item}
                isOpen={openDropdown === item.id}
                onOpen={() => setOpenDropdown(item.id)}
                onClose={() => setOpenDropdown(null)}
                isActive={isItemActive(item, location.pathname, location.search)}
              />
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            <button
              className="p-2.5 text-primary hover:text-accent active:text-accent transition-colors"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-[18px] w-[18px]" />
            </button>
            <Link to="/wishlist" className="p-2.5 text-primary hover:text-accent active:text-accent transition-colors hidden sm:block" aria-label="Wishlist">
              <Heart className="h-[18px] w-[18px]" />
            </Link>
            {user ? (
              <div ref={userMenuRef} className="relative hidden md:block">
                <button
                  className="p-2.5 text-primary hover:text-accent active:text-accent transition-colors"
                  aria-label="Account"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <User className="h-[18px] w-[18px]" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-background border border-border shadow-2xl z-50 py-1">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent/50 via-accent to-accent/50" />
                    <div className="px-5 py-3 border-b border-border">
                      <p className="text-[9px] text-muted-foreground font-display tracking-[0.15em] truncate uppercase">{user.email}</p>
                    </div>
                    <Link
                      to="/account"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-5 py-3 text-sm font-body font-medium text-foreground/90 hover:text-accent active:text-accent transition-colors"
                    >
                      <User className="h-4 w-4" /> My Account
                    </Link>
                    <Link
                      to="/account/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-5 py-3 text-sm font-body font-medium text-foreground/90 hover:text-accent active:text-accent transition-colors"
                    >
                      <Package className="h-4 w-4" /> My Orders
                    </Link>
                    <div className="ornate-line mx-4 my-1" />
                    <button
                      onClick={async () => { setUserMenuOpen(false); await signOut(); }}
                      className="flex items-center gap-3 w-full px-5 py-3 text-sm font-body font-medium text-destructive hover:bg-destructive/5 transition-colors"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="p-2.5 text-primary hover:text-accent active:text-accent transition-colors hidden md:block" aria-label="Login">
                <User className="h-[18px] w-[18px]" />
              </Link>
            )}
            <button
              className="p-2.5 text-primary hover:text-accent active:text-accent transition-colors relative"
              onClick={() => setIsCartOpen(true)}
              aria-label="Cart"
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-0.5 bg-accent text-accent-foreground text-[8px] font-bold h-4 w-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Bottom gold accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      </div>

      {/* ─── Mobile Nav Drawer (full-screen) ─── */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-40 md:hidden" onClick={() => setMobileOpen(false)} />
          <nav className="fixed inset-0 bg-background z-50 md:hidden flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
            {/* Maroon header with centered wordmark */}
            <div className="relative bg-primary text-primary-foreground px-5 pt-5 pb-6">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-accent/50 via-accent to-accent/50" />
              <div data-testid="currency-drawer" className="absolute left-3 top-3 [&_button]:text-primary-foreground/80 [&_button:hover]:text-accent">
                <CurrencySelector />
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-3 p-2 text-primary-foreground/80 hover:text-accent transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
              <Link to="/" onClick={() => setMobileOpen(false)} className="flex flex-col items-center mt-1">
                {/* Image logo on very narrow phones; wordmark when space allows */}
                <img 
                  src={logoSrc} 
                  alt="Manchala Gadwal Sarees" 
                  className="h-16 w-auto block xs:hidden brightness-110 drop-shadow-[0_0_10px_rgba(212,175,55,0.25)]" 
                />
                <span className="hidden xs:block font-display text-2xl sm:text-3xl font-bold tracking-[0.1em] leading-none">
                  MANCHALA
                </span>
                <span className="hidden xs:flex items-center gap-2 mt-2">
                  <span className="h-px w-6 bg-accent/70" />
                  <span className="font-body text-[9px] tracking-[0.4em] text-accent uppercase">
                    Gadwal Sarees
                  </span>
                  <span className="h-px w-6 bg-accent/70" />
                </span>
              </Link>
            </div>

            {/* Menu items */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-5 space-y-0.5">
              {[...menuItems, ...mobileMenuItems].map(item => {
                const children = item.children || [];
                const hasChildren = children.length > 0;
                const itemActive = isItemActive(item, location.pathname, location.search);

                if (!hasChildren) {
                  return (
                    <Link
                      key={item.id}
                      to={getItemUrl(item)}
                      onClick={() => setMobileOpen(false)}
                      aria-current={itemActive ? 'page' : undefined}
                      className={`flex items-center gap-3 py-3 text-[13px] tracking-[0.2em] font-display font-bold ${itemActive ? 'text-accent border-l-2 border-accent pl-3 -ml-3' : 'text-foreground/90'} hover:text-accent active:text-accent min-h-[44px] uppercase transition-colors`}
                    >
                      {item.label}
                    </Link>
                  );
                }

                return (
                  <div key={item.id}>
                    <button
                      onClick={() => setMobileExpanded(mobileExpanded === item.id ? null : item.id)}
                      aria-current={itemActive ? 'page' : undefined}
                      className={`flex items-center justify-between w-full py-3 text-[13px] tracking-[0.2em] font-display font-bold ${itemActive ? 'text-accent' : 'text-foreground/90'} hover:text-accent active:text-accent min-h-[44px] uppercase transition-colors`}
                    >
                      <span className={itemActive ? 'border-l-2 border-accent pl-3 -ml-3' : ''}>{item.label}</span>
                      <ChevronDown className={`h-4 w-4 text-accent/50 transition-transform duration-300 ${mobileExpanded === item.id ? 'rotate-180' : ''}`} />
                    </button>
                    {mobileExpanded === item.id && (
                      <div className="pl-4 pb-2 space-y-0.5 border-l-2 border-accent/30 ml-2">
                        {children.map(child => {
                          const childActive = isUrlActive(getItemUrl(child), location.pathname, location.search);
                          return (
                            <Link
                              key={child.id}
                              to={getItemUrl(child)}
                              onClick={() => { setMobileOpen(false); setMobileExpanded(null); }}
                              aria-current={childActive ? 'page' : undefined}
                              className={`flex items-center py-2.5 text-sm tracking-[0.08em] font-body font-semibold ${childActive ? 'text-accent' : 'text-foreground/80'} hover:text-accent active:text-accent transition-colors min-h-[44px]`}
                            >
                              <span className={`w-2 h-[1px] ${childActive ? 'bg-accent' : 'bg-accent/30'} mr-3`} />
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="ornate-line my-4" />

              {/* Account & utility links */}
              <div className="space-y-0.5">
                <Link
                  to="/wishlist"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 py-3 text-[12px] tracking-[0.2em] font-display text-foreground/70 hover:text-accent min-h-[44px] sm:hidden uppercase transition-colors"
                >
                  <Heart className="h-4 w-4 text-accent/50" /> Wishlist
                </Link>
                {user ? (
                  <>
                    <Link to="/account" onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 py-3 text-[12px] tracking-[0.2em] font-display text-foreground/70 hover:text-accent min-h-[44px] md:hidden uppercase transition-colors">
                      <User className="h-4 w-4 text-accent/50" /> My Account
                    </Link>
                    <Link to="/account/orders" onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 py-3 text-[12px] tracking-[0.2em] font-display text-foreground/70 hover:text-accent min-h-[44px] md:hidden uppercase transition-colors">
                      <Package className="h-4 w-4 text-accent/50" /> My Orders
                    </Link>
                    <button onClick={async () => { setMobileOpen(false); await signOut(); }}
                      className="flex items-center gap-3 py-3 text-[12px] tracking-[0.2em] font-display text-destructive hover:text-foreground min-h-[44px] md:hidden w-full text-left uppercase transition-colors">
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 py-3 text-[12px] tracking-[0.2em] font-display text-foreground/70 hover:text-accent min-h-[44px] md:hidden uppercase transition-colors">
                    <User className="h-4 w-4 text-accent/50" /> Login / Register
                  </Link>
                )}
                {topBarItems.map(item => (
                  <Link key={item.id} to={getItemUrl(item)} onClick={() => setMobileOpen(false)}
                    className="block py-3 text-[12px] tracking-[0.2em] font-display text-foreground/70 hover:text-accent min-h-[44px] uppercase transition-colors">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="p-5 border-t border-border">
              <a
                href="https://wa.me/919885879188"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-foreground text-background text-[10px] font-display tracking-[0.2em] uppercase hover:bg-primary transition-colors"
              >
                <Phone className="h-3.5 w-3.5 text-accent" />
                Call / WhatsApp Us
              </a>
            </div>
          </nav>
        </>
      )}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
