import {
  LayoutDashboard, Package, FolderOpen, ShoppingCart, Users, Settings,
  LogOut, Home, MessageSquare, Menu, Tag, Truck, Percent, Image,
  Star, HelpCircle, FileText, MessageCircleHeart, Mail, RotateCcw,
  ScrollText, Search, Store,
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarFooter, SidebarHeader, useSidebar,
} from '@/components/ui/sidebar';

import {
  LayoutDashboard, Package, FolderOpen, ShoppingCart, Users, Settings,
  LogOut, Home, MessageSquare, Menu, Tag, Truck, Percent, Image,
  Star, HelpCircle, FileText, MessageCircleHeart, Mail, RotateCcw,
  ScrollText, Search, Store, SlidersHorizontal,
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarFooter, SidebarHeader, useSidebar,
} from '@/components/ui/sidebar';

const storeItems = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'Products', url: '/admin/products', icon: Package },
  { title: 'Categories', url: '/admin/categories', icon: FolderOpen },
  { title: 'Orders', url: '/admin/orders', icon: ShoppingCart },
];

const marketingItems = [
  { title: 'Hero Slides', url: '/admin/hero-slides', icon: SlidersHorizontal },
  { title: 'Coupons', url: '/admin/coupons', icon: Percent },
  { title: 'Banners', url: '/admin/banners', icon: Image },
  { title: 'Blog', url: '/admin/blog', icon: FileText },
  { title: 'Testimonials', url: '/admin/testimonials', icon: MessageCircleHeart },
  { title: 'Newsletter', url: '/admin/newsletter', icon: Mail },
];

const configItems = [
  { title: 'Menu', url: '/admin/menu', icon: Menu },
  { title: 'Shipping', url: '/admin/shipping', icon: Truck },
  { title: 'Tax Rules', url: '/admin/tax', icon: Tag },
  { title: 'FAQ', url: '/admin/faq', icon: HelpCircle },
  { title: 'Page SEO', url: '/admin/page-seo', icon: Search },
  { title: 'Settings', url: '/admin/settings', icon: Settings },
];

const manageItems = [
  { title: 'Users', url: '/admin/users', icon: Users },
  { title: 'Reviews', url: '/admin/reviews', icon: Star },
  { title: 'Returns', url: '/admin/returns', icon: RotateCcw },
  { title: 'Contacts', url: '/admin/contacts', icon: MessageSquare },
  { title: 'Activity Log', url: '/admin/audit-log', icon: ScrollText },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const { signOut } = useAuth();

  const renderGroup = (label: string, items: typeof storeItems) => (
    <SidebarGroup>
      <SidebarGroupLabel className="text-[10px] font-body font-bold uppercase tracking-[0.15em] text-sidebar-foreground/40 mb-1">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map(item => {
            const active = item.url === '/admin'
              ? location.pathname === '/admin'
              : location.pathname.startsWith(item.url);
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <NavLink
                    to={item.url}
                    end={item.url === '/admin'}
                    className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 font-body text-[13px] transition-all duration-200 ${
                      active
                        ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                        : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
                    }`}
                    activeClassName=""
                  >
                    <item.icon className={`h-4 w-4 shrink-0 ${active ? '' : 'text-sidebar-foreground/50 group-hover:text-sidebar-foreground/70'}`} />
                    {!collapsed && <span>{item.title}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      {/* Logo header */}
      <SidebarHeader className="p-4 pb-2">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-sm">
            <Store className="h-4.5 w-4.5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-display text-sm font-bold leading-tight truncate">KWW Admin</p>
              <p className="font-body text-[10px] text-sidebar-foreground/50">Store Management</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 pt-2">
        {renderGroup('Store', storeItems)}
        {renderGroup('Marketing', marketingItems)}
        {renderGroup('Configuration', configItems)}
        {renderGroup('Management', manageItems)}
      </SidebarContent>

      <SidebarFooter className="px-2 pb-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/" className="flex items-center gap-3 rounded-lg px-3 py-2 font-body text-[13px] text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
                <Home className="h-4 w-4 text-sidebar-foreground/50" />
                {!collapsed && <span>View Store</span>}
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={signOut}
              className="flex items-center gap-3 rounded-lg px-3 py-2 font-body text-[13px] text-destructive/70 hover:text-destructive hover:bg-destructive/5 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              {!collapsed && <span>Sign Out</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
