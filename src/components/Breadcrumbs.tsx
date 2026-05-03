import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { Fragment } from 'react';
import { cn } from '@/lib/utils';

export interface Crumb {
  label: string;
  to?: string;
}

interface BreadcrumbsProps {
  items?: Crumb[];
  className?: string;
}

const labelMap: Record<string, string> = {
  collections: 'Collections',
  product: 'Product',
  about: 'About',
  contact: 'Contact',
  login: 'Login',
  signup: 'Sign Up',
  'reset-password': 'Reset Password',
  checkout: 'Checkout',
  wishlist: 'Wishlist',
  orders: 'Orders',
  account: 'My Account',
  addresses: 'Addresses',
  faq: 'FAQ',
  blog: 'Blog',
  'privacy-policy': 'Privacy Policy',
  terms: 'Terms & Conditions',
  'shipping-policy': 'Shipping Policy',
  'order-confirmation': 'Order Confirmation',
  'color-matching': 'Color Matching Tool',
};

const titleCase = (s: string) =>
  s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

function autoFromPath(pathname: string): Crumb[] {
  const parts = pathname.split('/').filter(Boolean);
  const crumbs: Crumb[] = [];
  let acc = '';
  parts.forEach((seg, i) => {
    acc += '/' + seg;
    const label = labelMap[seg] || titleCase(decodeURIComponent(seg));
    crumbs.push({ label, to: i === parts.length - 1 ? undefined : acc });
  });
  return crumbs;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const location = useLocation();
  const crumbs = items ?? autoFromPath(location.pathname);
  if (crumbs.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('w-full border-b border-border/50 bg-muted/20', className)}
    >
      <div className="container mx-auto px-4 py-3">
        <ol className="flex flex-wrap items-center gap-1.5 font-body text-[11px] tracking-wide text-muted-foreground uppercase">
          <li>
            <Link
              to="/"
              className="inline-flex items-center gap-1 hover:text-accent transition-colors"
              aria-label="Home"
            >
              <Home className="h-3 w-3" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </li>
          {crumbs.map((c, idx) => {
            const isLast = idx === crumbs.length - 1;
            return (
              <Fragment key={`${c.label}-${idx}`}>
                <li aria-hidden="true" className="text-muted-foreground/50">
                  <ChevronRight className="h-3 w-3" />
                </li>
                <li className="max-w-[60vw] truncate">
                  {isLast || !c.to ? (
                    <span
                      aria-current={isLast ? 'page' : undefined}
                      className="text-foreground font-semibold truncate"
                    >
                      {c.label}
                    </span>
                  ) : (
                    <Link to={c.to} className="hover:text-accent transition-colors truncate">
                      {c.label}
                    </Link>
                  )}
                </li>
              </Fragment>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

export default Breadcrumbs;
