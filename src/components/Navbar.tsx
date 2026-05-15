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

          {/* Desktop: split nav with centered wordmark — cap visible items per side, rest live in mobile/burger menu */}
          {(() => {
            const MAX_PER_SIDE = 5;
            const leftItems = menuItems.slice(0, MAX_PER_SIDE);
            const rightItems = menuItems.slice(MAX_PER_SIDE, MAX_PER_SIDE * 2);
            return (
              <>
                <nav className="hidden md:flex flex-1 items-center justify-end gap-5 lg:gap-6 min-w-0">
                  <div data-testid="currency-desktop" className="flex items-center">
                    <CurrencySelector />
                  </div>
                  <span aria-hidden="true" className="h-4 w-px bg-border/80" />
                  {leftItems.map(item => (
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

                {/* Wordmark logo (Kankatala-style) — shown on all breakpoints */}
                <Link to="/" className="flex flex-col items-center shrink-0 px-2 md:px-6 group" aria-label="Manchala Gadwal Sarees">
                  <span className="font-display text-2xl sm:text-3xl lg:text-[34px] font-bold tracking-[0.08em] text-primary leading-none">
                    MANCHALA
                  </span>
                  <span className="flex items-center gap-2 mt-1 sm:mt-1.5">
                    <span className="h-px w-4 sm:w-6 bg-accent/60" />
                    <span className="font-body text-[8px] sm:text-[9px] tracking-[0.35em] sm:tracking-[0.4em] text-accent uppercase whitespace-nowrap">Gadwal Sarees</span>
                    <span className="h-px w-4 sm:w-6 bg-accent/60" />
                  </span>
                </Link>

                <nav className="hidden md:flex flex-1 items-center justify-start gap-5 lg:gap-7 min-w-0">
                  {rightItems.map(item => (
                    <MegaNavItem
                      key={item.id}
                      item={item}
                      isOpen={openDropdown === item.id}
                      onOpen={() => setOpenDropdown(item.id)}
                      onClose={() => setOpenDropdown(null)}
                      isActive={isItemActive(item, location.pathname, location.search)}
                    />
                  ))}
                  {menuItems.length > MAX_PER_SIDE * 2 && (
                    <Link
                      to="/collections"
                      className="text-xs tracking-[0.18em] font-display font-medium text-primary/80 hover:text-accent uppercase whitespace-nowrap"
                    >
                      All ▾
                    </Link>
                  )}
                </nav>
              </>
            );
          })()}
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

      {/* ─── Mobile Nav Drawer (side, dense) ─── */}
      {mobileOpen && (() => {
        // Auto-group flat menu items by family for better hierarchy
        const allItems = [...menuItems, ...mobileMenuItems];
        const groupOf = (label: string) => {
          const l = label.toLowerCase();
          if (l.includes('gadwal')) return 'Gadwal Sarees';
          if (l.includes('kanchi') || l.includes('korvai')) return 'Kanchipuram Sarees';
          if (l.includes('bandhani') || l.includes('kalamkari') || l.includes('tissue') || l.includes('silk') || l.includes('cotton') || l.includes('bridal') || l.includes('vintage')) return 'Other Collections';
          return 'Shop';
        };
        const groups = allItems.reduce<Record<string, typeof allItems>>((acc, it) => {
          // Items that already have children render as their own group
          if ((it.children || []).length > 0) {
            acc[it.label] = [...(acc[it.label] || []), it];
          } else {
            const g = groupOf(it.label);
            acc[g] = [...(acc[g] || []), it];
          }
          return acc;
        }, {});
        const groupNames = Object.keys(groups);

        return (
          <>
            <div className="fixed inset-0 bg-foreground/50 z-40 md:hidden animate-in fade-in duration-150" onClick={() => setMobileOpen(false)} />
            <nav className="fixed inset-y-0 left-0 w-[88vw] max-w-[360px] bg-background z-50 md:hidden flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
              {/* Compact header */}
              <div className="relative bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between">
                <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 min-w-0">
                  <img src={logoSrc} alt="" className="h-8 w-8 object-contain shrink-0" />
                  <div className="flex flex-col leading-tight min-w-0">
                    <span className="font-display text-sm font-bold tracking-[0.12em] truncate">MANCHALA</span>
                    <span className="font-body text-[8px] tracking-[0.3em] text-accent uppercase truncate">Gadwal Sarees</span>
                  </div>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 -mr-2 text-primary-foreground/90 hover:text-accent transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Account strip */}
              <div className="bg-secondary/40 border-b border-border px-4 py-3">
                {user ? (
                  <div className="flex items-center justify-between gap-2">
                    <Link to="/account" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display text-sm shrink-0">
                        {(user.email || '?')[0].toUpperCase()}
                      </span>
                      <div className="flex flex-col leading-tight min-w-0">
                        <span className="font-body font-semibold text-[12px] text-foreground truncate">My Account</span>
                        <span className="font-body text-[10px] text-muted-foreground truncate">{user.email}</span>
                      </div>
                    </Link>
                    <button
                      onClick={async () => { setMobileOpen(false); await signOut(); }}
                      className="p-2 text-destructive hover:bg-destructive/5 rounded min-h-[40px] min-w-[40px] flex items-center justify-center"
                      aria-label="Logout"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2 bg-primary text-primary-foreground text-[11px] tracking-[0.15em] font-display uppercase font-semibold hover:bg-primary/90 transition-colors">
                      Login
                    </Link>
                    <Link to="/login?mode=register" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2 border border-primary text-primary text-[11px] tracking-[0.15em] font-display uppercase font-semibold hover:bg-primary/5 transition-colors">
                      Register
                    </Link>
                  </div>
                )}

                {/* Quick action grid */}
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="flex flex-col items-center gap-1 py-2 bg-background border border-border hover:border-accent hover:text-accent transition-colors">
                    <Heart className="h-4 w-4 text-accent" />
                    <span className="text-[9px] tracking-[0.15em] font-display uppercase">Wishlist</span>
                  </Link>
                  {user && (
                    <Link to="/account/orders" onClick={() => setMobileOpen(false)} className="flex flex-col items-center gap-1 py-2 bg-background border border-border hover:border-accent hover:text-accent transition-colors">
                      <Package className="h-4 w-4 text-accent" />
                      <span className="text-[9px] tracking-[0.15em] font-display uppercase">Orders</span>
                    </Link>
                  )}
                  <button
                    onClick={() => { setMobileOpen(false); setSearchOpen(true); }}
                    className="flex flex-col items-center gap-1 py-2 bg-background border border-border hover:border-accent hover:text-accent transition-colors"
                  >
                    <Search className="h-4 w-4 text-accent" />
                    <span className="text-[9px] tracking-[0.15em] font-display uppercase">Search</span>
                  </button>
                </div>
              </div>

              {/* Grouped, collapsible items */}
              <div className="flex-1 overflow-y-auto overscroll-contain">
                {groupNames.map((g, gi) => {
                  const items = groups[g];
                  const isOpen = mobileExpanded === g;
                  return (
                    <div key={g} className={gi > 0 ? 'border-t border-border' : ''}>
                      <button
                        onClick={() => setMobileExpanded(isOpen ? null : g)}
                        className="flex items-center justify-between w-full px-4 py-3 text-[11px] tracking-[0.22em] font-display font-bold text-primary uppercase hover:bg-secondary/40 transition-colors min-h-[44px]"
                        aria-expanded={isOpen}
                      >
                        <span>{g}</span>
                        <ChevronDown className={`h-4 w-4 text-accent transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && (
                        <ul className="pb-2">
                          {items.map(it => {
                            const itActive = isItemActive(it, location.pathname, location.search);
                            return (
                              <li key={it.id}>
                                <Link
                                  to={getItemUrl(it)}
                                  onClick={() => { setMobileOpen(false); setMobileExpanded(null); }}
                                  aria-current={itActive ? 'page' : undefined}
                                  className={`flex items-center gap-3 pl-7 pr-4 py-2.5 text-[12.5px] font-body ${itActive ? 'text-accent font-semibold bg-accent/5 border-l-2 border-accent' : 'text-foreground/85 border-l-2 border-transparent'} hover:text-accent active:bg-accent/5 transition-colors min-h-[40px] capitalize`}
                                >
                                  <span className={`h-1 w-1 rounded-full ${itActive ? 'bg-accent' : 'bg-accent/40'}`} />
                                  {it.label}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  );
                })}

                {topBarItems.length > 0 && (
                  <div className="border-t border-border bg-secondary/20">
                    <p className="px-4 pt-3 pb-1 text-[9px] tracking-[0.25em] font-display text-muted-foreground uppercase">Help & Info</p>
                    <ul className="pb-2">
                      {topBarItems.map(item => (
                        <li key={item.id}>
                          <Link
                            to={getItemUrl(item)}
                            onClick={() => setMobileOpen(false)}
                            className="block px-4 py-2.5 text-[12px] font-body text-foreground/75 hover:text-accent hover:bg-secondary/40 transition-colors min-h-[40px]"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Sticky bottom CTAs */}
              <div className="grid grid-cols-2 border-t border-border">
                <a
                  href="tel:+919885879188"
                  className="flex items-center justify-center gap-2 py-3 bg-foreground text-background text-[10px] font-display tracking-[0.18em] uppercase hover:bg-primary transition-colors"
                >
                  <Phone className="h-3.5 w-3.5 text-accent" />
                  Call
                </a>
                <a
                  href={`https://wa.me/${settings?.whatsapp_number || '919885879188'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 bg-[#25D366] text-white text-[10px] font-display tracking-[0.18em] uppercase hover:opacity-90 transition-opacity"
                >
                  <WhatsAppIcon className="h-3.5 w-3.5" />
                  WhatsApp
                </a>
              </div>
            </nav>
          </>
        );
      })()}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
