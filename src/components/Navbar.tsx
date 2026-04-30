import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X, ChevronDown, Phone, Heart, User, LogOut, Package } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { SearchOverlay } from '@/components/SearchOverlay';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import { useMenuItems, type MenuItem } from '@/hooks/useMenuItems';
import logo from '@/assets/logo.png';

function getItemUrl(item: MenuItem) {
  if (item.url) return item.url;
  if (item.slug) return `/collections?filter=${item.slug}`;
  return '/collections';
}

function DropdownNavItem({ item, isOpen, onToggle, onClose }: {
  item: MenuItem;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
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
        className="relative text-[13px] tracking-[0.02em] font-body font-medium text-primary hover:text-accent transition-colors py-2 capitalize"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={onToggle}
        onMouseEnter={onToggle}
        className="flex items-center gap-1 text-[13px] tracking-[0.02em] font-body font-medium text-primary hover:text-accent transition-colors py-2 capitalize"
      >
        {item.label}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 bg-background border border-border/70 shadow-xl min-w-[240px] py-3 z-50"
          onMouseLeave={onClose}
        >
          {children.map(child => (
            <Link
              key={child.id}
              to={getItemUrl(child)}
              onClick={onClose}
              className="block px-6 py-2 text-[13px] font-body text-primary/85 hover:text-accent hover:bg-secondary/50 transition-colors"
            >
              {child.label}
            </Link>
          ))}
          {item.slug && (
            <>
              <div className="border-t border-border/60 mx-5 my-2" />
              <Link
                to={`/collections?filter=${item.slug}`}
                onClick={onClose}
                className="block px-6 py-2 text-[11px] tracking-[0.15em] font-body font-bold text-accent hover:text-primary transition-colors uppercase"
              >
                View All →
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
        <div className="container flex items-center justify-between h-8">
          <nav className="flex items-center gap-6">
            {topBarItems.map(item => (
              <Link
                key={item.id}
                to={getItemUrl(item)}
                className="text-[10px] tracking-[0.2em] font-display font-medium text-background/70 hover:text-accent transition-colors uppercase"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <a
            href="https://wa.me/919494644998"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[10px] tracking-[0.1em] font-body font-normal text-background/70 hover:text-accent transition-colors"
          >
            <Phone className="h-3 w-3 text-accent/70" />
            +91 94946 44998
          </a>
        </div>
        {/* Bottom gold accent */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      </div>

      {/* ─── Main Navigation ─── */}
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border/50 relative">
        <div className="container flex items-center justify-between py-2 md:py-3">
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-foreground/70 hover:text-accent transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Logo — centered approach */}
          <Link to="/" className="flex items-center">
            <img src={logoSrc} alt="Manchala Gadwal Sarees" className="h-20 sm:h-24 md:h-24 w-auto" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {menuItems.map(item => (
              <DropdownNavItem
                key={item.id}
                item={item}
                isOpen={openDropdown === item.id}
                onToggle={() => setOpenDropdown(openDropdown === item.id ? null : item.id)}
                onClose={() => setOpenDropdown(null)}
              />
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            <button
              className="p-2.5 text-foreground/80 hover:text-accent transition-colors"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-[18px] w-[18px]" />
            </button>
            <Link to="/wishlist" className="p-2.5 text-foreground/80 hover:text-accent transition-colors hidden sm:block" aria-label="Wishlist">
              <Heart className="h-[18px] w-[18px]" />
            </Link>
            {user ? (
              <div ref={userMenuRef} className="relative hidden md:block">
                <button
                  className="p-2.5 text-foreground/80 hover:text-accent transition-colors"
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
                      className="flex items-center gap-3 px-5 py-3 text-sm font-body hover:bg-accent/5 hover:text-accent transition-colors"
                    >
                      <User className="h-4 w-4" /> My Account
                    </Link>
                    <Link
                      to="/account/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-5 py-3 text-sm font-body hover:bg-accent/5 hover:text-accent transition-colors"
                    >
                      <Package className="h-4 w-4" /> My Orders
                    </Link>
                    <div className="ornate-line mx-4 my-1" />
                    <button
                      onClick={async () => { setUserMenuOpen(false); await signOut(); }}
                      className="flex items-center gap-3 w-full px-5 py-3 text-sm font-body text-destructive hover:bg-destructive/5 transition-colors"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="p-2.5 text-foreground/80 hover:text-accent transition-colors hidden md:block" aria-label="Login">
                <User className="h-[18px] w-[18px]" />
              </Link>
            )}
            <button
              className="p-2.5 text-foreground/80 hover:text-accent transition-colors relative"
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

      {/* ─── Mobile Nav Drawer ─── */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-40 md:hidden" onClick={() => setMobileOpen(false)} />
          <nav className="fixed top-0 left-0 bottom-0 w-[85vw] max-w-sm bg-background z-50 md:hidden flex flex-col shadow-2xl">
            {/* Header */}
            <div className="relative p-5 border-b border-border">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent/50 via-accent to-accent/50" />
              <div className="flex items-center justify-between">
                <Link to="/" onClick={() => setMobileOpen(false)}>
                  <img src={logoSrc} alt="Manchala Gadwal Sarees" className="h-16 w-auto" />
                </Link>
                <button onClick={() => setMobileOpen(false)} className="p-2 text-foreground/60 hover:text-accent transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Menu items */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-5 space-y-0.5">
              {[...menuItems, ...mobileMenuItems].map(item => {
                const children = item.children || [];
                const hasChildren = children.length > 0;

                if (!hasChildren) {
                  return (
                    <Link
                      key={item.id}
                      to={getItemUrl(item)}
                      onClick={() => setMobileOpen(false)}
                      className="block py-3 text-[12px] tracking-[0.2em] font-display font-semibold text-foreground/70 hover:text-accent min-h-[44px] uppercase transition-colors"
                    >
                      {item.label}
                    </Link>
                  );
                }

                return (
                  <div key={item.id}>
                    <button
                      onClick={() => setMobileExpanded(mobileExpanded === item.id ? null : item.id)}
                      className="flex items-center justify-between w-full py-3 text-[12px] tracking-[0.2em] font-display font-semibold text-foreground/70 min-h-[44px] uppercase"
                    >
                      {item.label}
                      <ChevronDown className={`h-4 w-4 text-accent/50 transition-transform duration-300 ${mobileExpanded === item.id ? 'rotate-180' : ''}`} />
                    </button>
                    {mobileExpanded === item.id && (
                      <div className="pl-4 pb-2 space-y-0.5 border-l-2 border-accent/30 ml-2">
                        {children.map(child => (
                          <Link
                            key={child.id}
                            to={getItemUrl(child)}
                            onClick={() => { setMobileOpen(false); setMobileExpanded(null); }}
                            className="flex items-center py-2.5 text-sm tracking-[0.08em] font-body text-muted-foreground hover:text-accent transition-colors min-h-[44px]"
                          >
                            <span className="w-2 h-[1px] bg-accent/30 mr-3" />
                            {child.label}
                          </Link>
                        ))}
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
                href="https://wa.me/919494644998"
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
