import { Home, Grid3X3, ShoppingBag, User, Heart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Grid3X3, label: 'Shop', path: '/collections' },
  { icon: ShoppingBag, label: 'Cart', path: '__cart__' },
  { icon: Heart, label: 'Wishlist', path: '/wishlist' },
  { icon: User, label: 'Account', path: '__account__' },
];

export function MobileBottomNav() {
  const location = useLocation();
  const { totalItems, setIsCartOpen } = useCart();
  const { user } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border/60 md:hidden safe-bottom shadow-[0_-4px_20px_-8px_hsl(var(--foreground)/0.15)]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      <div className="flex items-stretch justify-around h-16">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isCart = path === '__cart__';
          const isAccount = path === '__account__';
          const actualPath = isAccount ? (user ? '/account' : '/login') : path;
          const isActive = !isCart && (path === '/' ? location.pathname === '/' : location.pathname.startsWith(actualPath));

          const Inner = (
            <>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-accent rounded-full" />
              )}
              <span className={cn(
                'relative flex items-center justify-center h-7 w-7 rounded-full transition-all duration-300',
                isActive ? 'bg-accent/15 scale-110' : 'scale-100'
              )}>
                <Icon className={cn('h-[18px] w-[18px] transition-colors', isActive ? 'text-accent' : 'text-foreground/55')} strokeWidth={isActive ? 2.2 : 1.8} />
                {isCart && totalItems > 0 && (
                  <span className="absolute -top-1 -right-1.5 bg-accent text-accent-foreground text-[9px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center shadow-sm">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </span>
              <span className={cn(
                'text-[9.5px] font-display tracking-[0.12em] uppercase mt-0.5 transition-colors',
                isActive ? 'text-accent font-semibold' : 'text-foreground/55'
              )}>{label}</span>
            </>
          );

          const baseCls = 'relative flex flex-col items-center justify-center flex-1 min-h-[44px] py-1.5 active:bg-accent/5 transition-colors';

          if (isCart) {
            return (
              <button key={label} onClick={() => setIsCartOpen(true)} aria-label="Open cart" className={baseCls}>
                {Inner}
              </button>
            );
          }
          return (
            <Link key={label} to={actualPath} aria-label={label} className={baseCls}>
              {Inner}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
