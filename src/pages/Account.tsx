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
      <main className="container py-8 md:py-12">
        <h1 className="font-display text-2xl md:text-3xl font-bold mb-8">My Account</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="md:w-56 shrink-0">
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
                      'flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-body whitespace-nowrap transition-colors',
                      active
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted text-muted-foreground'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
              <button
                onClick={async () => { await signOut(); navigate('/'); }}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-body whitespace-nowrap text-destructive hover:bg-muted transition-colors"
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
