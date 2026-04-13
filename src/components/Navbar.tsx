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
        className="text-[11px] tracking-[0.25em] font-display font-semibold text-foreground/70 hover:text-primary transition-colors py-2 uppercase"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative group">
      <button
        onClick={onToggle}
        onMouseEnter={onToggle}
        className="flex items-center gap-1 text-[11px] tracking-[0.25em] font-display font-semibold text-foreground/70 hover:text-primary transition-colors py-2 uppercase"
      >
        {item.label}
        <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 bg-background border border-border shadow-xl min-w-[240px] py-3 z-50"
          onMouseLeave={onClose}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent" />
          {children.map(child => (
            <Link
              key={child.id}
              to={getItemUrl(child)}
              onClick={onClose}
              className="block px-6 py-2.5 text-[11px] tracking-[0.1em] font-body text-foreground/60 hover:text-primary hover:bg-primary/5 transition-colors"
            >
              {child.label}
            </Link>
          ))}
          {item.slug && (
            <>
              <div className="ornate-line mx-4 my-2" />
              <Link
                to={`/collections?filter=${item.slug}`}
                onClick={onClose}
                className="block px-6 py-2 text-[11px] tracking-[0.15em] font-display font-bold text-primary hover:text-primary/80 transition-colors"
              >
                VIEW ALL {item.label} →
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
      {/* Top utility bar */}
      <div className="bg-foreground text-background hidden md:block">
        <div className="container flex items-center justify-between h-8">
          <nav className="flex items-center gap-5">
            {topBarItems.map(item => (
              <Link
                key={item.id}
                to={getItemUrl(item)}
                className="text-[10px] tracking-[0.15em] font-body text-background/60 hover:text-accent transition-colors uppercase"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/919494644998"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[10px] tracking-[0.05em] font-body text-background/60 hover:text-accent transition-colors"
            >
              <Phone className="h-3 w-3" />
              +91 94946 44998
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border relative">
        {/* Subtle gold accent line at bottom of nav */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

        <div className="container flex items-center justify-between h-20 md:h-24">
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
            <img src={logoSrc} alt="Kavi Women's World" className="h-20 sm:h-22 md:h-24 w-auto" />
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
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
            <button className="p-2.5 hover:text-primary transition-colors" aria-label="Search" onClick={() => setSearchOpen(true)}>
              <Search className="h-5 w-5" />
            </button>
            <Link to="/wishlist" className="p-2.5 hover:text-primary transition-colors hidden sm:block" aria-label="Wishlist">
              <Heart className="h-5 w-5" />
            </Link>
            {user ? (
              <div ref={userMenuRef} className="relative hidden md:block">
                <button
                  className="p-2.5 hover:text-primary transition-colors"
                  aria-label="Account"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <User className="h-5 w-5" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-52 bg-background border border-border shadow-xl z-50 py-1">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent" />
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-[10px] text-muted-foreground font-body truncate tracking-wider">{user.email}</p>
                    </div>
                    <Link
                      to="/account"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-body hover:bg-primary/5 hover:text-primary transition-colors"
                    >
                      <User className="h-4 w-4" /> My Account
                    </Link>
                    <Link
                      to="/account/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-body hover:bg-primary/5 hover:text-primary transition-colors"
                    >
                      <Package className="h-4 w-4" /> My Orders
                    </Link>
                    <button
                      onClick={async () => { setUserMenuOpen(false); await signOut(); }}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-body text-destructive hover:bg-destructive/5 transition-colors"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="p-2.5 hover:text-primary transition-colors hidden md:block" aria-label="Login">
                <User className="h-5 w-5" />
              </Link>
            )}
            <button
              className="p-2.5 hover:text-primary transition-colors relative"
              onClick={() => setIsCartOpen(true)}
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-accent text-accent-foreground text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="md:hidden border-b border-border bg-background px-4 py-3 space-y-0.5 max-h-[75vh] overflow-y-auto overscroll-contain">
          <div className="ornate-line mb-3" />
          {[...menuItems, ...mobileMenuItems].map(item => {
            const children = item.children || [];
            const hasChildren = children.length > 0;

            if (!hasChildren) {
              return (
                <Link
                  key={item.id}
                  to={getItemUrl(item)}
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 text-[12px] tracking-[0.2em] font-display font-semibold text-foreground/70 hover:text-primary min-h-[44px] uppercase"
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
                  <ChevronDown className={`h-4 w-4 transition-transform ${mobileExpanded === item.id ? 'rotate-180' : ''}`} />
                </button>
                {mobileExpanded === item.id && (
                  <div className="pl-4 pb-2 space-y-0.5 border-l-2 border-accent/30 ml-2">
                    {children.map(child => (
                      <Link
                        key={child.id}
                        to={getItemUrl(child)}
                        onClick={() => { setMobileOpen(false); setMobileExpanded(null); }}
                        className="block py-2.5 text-sm tracking-[0.08em] font-body text-muted-foreground hover:text-primary transition-colors min-h-[44px] flex items-center"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <div className="ornate-line my-3" />

          <div className="space-y-0.5">
            <Link
              to="/wishlist"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 py-3 text-[12px] tracking-[0.2em] font-display text-foreground/70 hover:text-primary min-h-[44px] sm:hidden uppercase"
            >
              <Heart className="h-4 w-4" /> Wishlist
            </Link>
            {user ? (
              <>
                <Link
                  to="/account"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 py-3 text-[12px] tracking-[0.2em] font-display text-foreground/70 hover:text-primary min-h-[44px] md:hidden uppercase"
                >
                  <User className="h-4 w-4" /> My Account
                </Link>
                <Link
                  to="/account/orders"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 py-3 text-[12px] tracking-[0.2em] font-display text-foreground/70 hover:text-primary min-h-[44px] md:hidden uppercase"
                >
                  <Package className="h-4 w-4" /> My Orders
                </Link>
                <button
                  onClick={async () => { setMobileOpen(false); await signOut(); }}
                  className="flex items-center gap-2 py-3 text-[12px] tracking-[0.2em] font-display text-destructive hover:text-foreground min-h-[44px] md:hidden w-full text-left uppercase"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 py-3 text-[12px] tracking-[0.2em] font-display text-foreground/70 hover:text-primary min-h-[44px] md:hidden uppercase"
              >
                <User className="h-4 w-4" /> Login
              </Link>
            )}
            {topBarItems.map(item => (
              <Link
                key={item.id}
                to={getItemUrl(item)}
                onClick={() => setMobileOpen(false)}
                className="block py-3 text-[12px] tracking-[0.2em] font-display text-foreground/70 hover:text-primary min-h-[44px] uppercase"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
