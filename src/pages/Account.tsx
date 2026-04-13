import { useEffect } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PageMeta } from '@/components/PageMeta';
import { User, MapPin, Package, Heart, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/account', label: 'Profile', icon: User, exact: true },
  { to: '/account/addresses', label: 'Addresses', icon: MapPin },
  { to: '/account/orders', label: 'Orders', icon: Package },
  { to: '/account/wishlist', label: 'Wishlist', icon: Heart },
];

export default function Account() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) navigate('/login', { replace: true });
  }, [user, loading, navigate]);

  if (loading || !user) return null;

  return (
    <div className="min-h-screen">
      <PageMeta title="My Account" description="Manage your account settings, addresses and orders." canonicalPath="/account" />
      <AnnouncementBar />
      <Navbar />

      <main className="container py-8 md:py-14">
        {/* Page header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-[2px] bg-accent" />
            <span className="font-body text-[10px] tracking-[0.4em] uppercase text-accent">My Account</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-wide">
            Welcome, <span className="gold-shimmer">{user.user_metadata?.full_name?.split(' ')[0] || 'Guest'}</span>
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Sidebar navigation */}
          <aside className="md:w-52 shrink-0">
            <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
              {navItems.map(item => {
                const active = item.exact
                  ? location.pathname === item.to
                  : location.pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      'flex items-center gap-2.5 px-4 py-2.5 text-[11px] font-display font-bold tracking-[0.12em] uppercase whitespace-nowrap transition-all border-l-2',
                      active
                        ? 'border-accent text-accent bg-accent/5'
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-accent/30'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}

              <div className="ornate-line my-2 hidden md:block" />

              <button
                onClick={async () => { await signOut(); navigate('/'); }}
                className="flex items-center gap-2.5 px-4 py-2.5 text-[11px] font-display font-bold tracking-[0.12em] uppercase whitespace-nowrap text-destructive hover:bg-destructive/5 transition-colors border-l-2 border-transparent"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <Outlet />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
