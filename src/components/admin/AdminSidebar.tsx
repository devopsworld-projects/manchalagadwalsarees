import {
  LayoutDashboard, Package, FolderOpen, ShoppingCart, Users, Settings,
  LogOut, Home, MessageSquare, Menu, Tag, Truck, Percent, Image,
  Star, HelpCircle, FileText, MessageCircleHeart, Mail, RotateCcw,
  ScrollText, Search,
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarFooter, useSidebar,
} from '@/components/ui/sidebar';

const storeItems = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'Products', url: '/admin/products', icon: Package },
  { title: 'Categories', url: '/admin/categories', icon: FolderOpen },
  { title: 'Orders', url: '/admin/orders', icon: ShoppingCart },
];

const marketingItems = [
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

  const isActive = (path: string) =>
    path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(path);

  const renderGroup = (label: string, items: typeof storeItems) => (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map(item => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink to={item.url} end={item.url === '/admin'} className="hover:bg-muted/50" activeClassName="bg-muted text-primary font-medium">
                  <item.icon className="mr-2 h-4 w-4" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {renderGroup('Store', storeItems)}
        {renderGroup('Marketing', marketingItems)}
        {renderGroup('Configuration', configItems)}
        {renderGroup('Management', manageItems)}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/" className="hover:bg-muted/50">
                <Home className="mr-2 h-4 w-4" />
                {!collapsed && <span>View Store</span>}
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={signOut} className="hover:bg-destructive/10 text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              {!collapsed && <span>Sign Out</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
