import { Home, Grid3X3, ShoppingBag, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Grid3X3, label: 'Shop', path: '/collections' },
  { icon: ShoppingBag, label: 'Cart', path: '__cart__' },
  { icon: User, label: 'Account', path: '__account__' },
];

export function MobileBottomNav() {
  const location = useLocation();
  const { totalItems, setIsCartOpen } = useCart();
  const { user } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-t border-border/50 md:hidden safe-bottom">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      <div className="flex items-center justify-around h-14">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isCart = path === '__cart__';
          const isAccount = path === '__account__';
          const actualPath = isAccount ? (user ? '/account' : '/login') : path;
          const isActive = !isCart && !isAccount && location.pathname === path;

          if (isCart) {
            return (
              <button
                key={label}
                onClick={() => setIsCartOpen(true)}
                className="flex flex-col items-center justify-center gap-0.5 min-w-[64px] py-1 text-foreground/40 relative"
              >
                <Icon className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-2 bg-accent text-accent-foreground text-[8px] font-bold h-4 w-4 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
                <span className="text-[9px] font-display tracking-[0.1em] uppercase">{label}</span>
              </button>
            );
          }

          return (
            <Link
              key={label}
              to={actualPath}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 min-w-[64px] py-1 transition-colors relative',
                isActive ? 'text-accent' : 'text-foreground/40'
              )}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-accent" />
              )}
              <Icon className="h-5 w-5" />
              <span className="text-[9px] font-display tracking-[0.1em] uppercase">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
