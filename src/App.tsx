import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { CartDrawer } from "@/components/CartDrawer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { TempleSplash } from "@/components/TempleSplash";
import ScrollToTop from "@/components/ScrollToTop";
import { useState, useCallback, lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";
import { PageSkeleton, AdminPageSkeleton } from "@/components/PageSkeleton";

const Index = lazy(() => import("./pages/Index.tsx"));
const Collections = lazy(() => import("./pages/Collections.tsx"));
const ProductDetail = lazy(() => import("./pages/ProductDetail.tsx"));
const About = lazy(() => import("./pages/About.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));
const Login = lazy(() => import("./pages/Login.tsx"));
const Signup = lazy(() => import("./pages/Signup.tsx"));
const ResetPassword = lazy(() => import("./pages/ResetPassword.tsx"));
const Checkout = lazy(() => import("./pages/Checkout.tsx"));
const Wishlist = lazy(() => import("./pages/Wishlist.tsx"));
const Orders = lazy(() => import("./pages/Orders.tsx"));
const Account = lazy(() => import("./pages/Account.tsx"));
const ProfilePage = lazy(() => import("./pages/account/ProfilePage.tsx"));
const AddressesPage = lazy(() => import("./pages/account/AddressesPage.tsx"));
const OrdersPage = lazy(() => import("./pages/account/OrdersPage.tsx"));
const WishlistPage = lazy(() => import("./pages/account/WishlistPage.tsx"));
const FAQ = lazy(() => import("./pages/FAQ.tsx"));
const Blog = lazy(() => import("./pages/Blog.tsx"));
const BlogPost = lazy(() => import("./pages/BlogPost.tsx"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin.tsx"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout.tsx"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.tsx"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts.tsx"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories.tsx"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders.tsx"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers.tsx"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings.tsx"));
const AdminContacts = lazy(() => import("./pages/admin/AdminContacts.tsx"));
const AdminMenu = lazy(() => import("./pages/admin/AdminMenu.tsx"));
const AdminCoupons = lazy(() => import("./pages/admin/AdminCoupons.tsx"));
const AdminShipping = lazy(() => import("./pages/admin/AdminShipping.tsx"));
const AdminTax = lazy(() => import("./pages/admin/AdminTax.tsx"));
const AdminBanners = lazy(() => import("./pages/admin/AdminBanners.tsx"));
const AdminReviews = lazy(() => import("./pages/admin/AdminReviews.tsx"));
const AdminFAQ = lazy(() => import("./pages/admin/AdminFAQ.tsx"));
const AdminBlog = lazy(() => import("./pages/admin/AdminBlog.tsx"));
const AdminTestimonials = lazy(() => import("./pages/admin/AdminTestimonials.tsx"));
const AdminGoogleReviews = lazy(() => import("./pages/admin/AdminGoogleReviews.tsx"));
const AdminNewsletter = lazy(() => import("./pages/admin/AdminNewsletter.tsx"));
const AdminReturns = lazy(() => import("./pages/admin/AdminReturns.tsx"));
const AdminAuditLog = lazy(() => import("./pages/admin/AdminAuditLog.tsx"));
const AdminPageSEO = lazy(() => import("./pages/admin/AdminPageSEO.tsx"));
const AdminHeroSlides = lazy(() => import("./pages/admin/AdminHeroSlides.tsx"));
const AdminSections = lazy(() => import("./pages/admin/AdminSections.tsx"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy.tsx"));
const Terms = lazy(() => import("./pages/Terms.tsx"));
const ShippingPolicy = lazy(() => import("./pages/ShippingPolicy.tsx"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation.tsx"));
const ColorMatchingTool = lazy(() => import("./pages/ColorMatchingTool.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

function RouteFallback() {
  const { pathname } = useLocation();
  return pathname.startsWith('/admin') ? <AdminPageSkeleton /> : <PageSkeleton />;
}

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(() => {
    // Only show once per session
    if (sessionStorage.getItem('manchala-splash-shown')) return false;
    return true;
  });

  const handleSplashComplete = useCallback(() => {
    sessionStorage.setItem('manchala-splash-shown', 'true');
    setShowSplash(false);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {showSplash && <TempleSplash onComplete={handleSplashComplete} />}
        <BrowserRouter>
          <AuthProvider>
            <ScrollToTop />
            <CurrencyProvider>
            <CartProvider>
              <CartDrawer />
              <WhatsAppButton />
              <MobileBottomNav />
              <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/account" element={<Account />}>
                  <Route index element={<ProfilePage />} />
                  <Route path="addresses" element={<AddressesPage />} />
                  <Route path="orders" element={<OrdersPage />} />
                  <Route path="wishlist" element={<WishlistPage />} />
                </Route>
                <Route path="/faq" element={<FAQ />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/shipping-policy" element={<ShippingPolicy />} />
                <Route path="/color-matching" element={<ColorMatchingTool />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="contacts" element={<AdminContacts />} />
                  <Route path="menu" element={<AdminMenu />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="coupons" element={<AdminCoupons />} />
                  <Route path="shipping" element={<AdminShipping />} />
                  <Route path="tax" element={<AdminTax />} />
                  <Route path="banners" element={<AdminBanners />} />
                  <Route path="hero-slides" element={<AdminHeroSlides />} />
                  <Route path="sections" element={<AdminSections />} />
                  <Route path="reviews" element={<AdminReviews />} />
                  <Route path="faq" element={<AdminFAQ />} />
                  <Route path="blog" element={<AdminBlog />} />
                  <Route path="testimonials" element={<AdminTestimonials />} />
                  <Route path="newsletter" element={<AdminNewsletter />} />
                  <Route path="returns" element={<AdminReturns />} />
                  <Route path="audit-log" element={<AdminAuditLog />} />
                  <Route path="page-seo" element={<AdminPageSEO />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
              </Suspense>
            </CartProvider>
            </CurrencyProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
