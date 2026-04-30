import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartDrawer } from "@/components/CartDrawer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { TempleSplash } from "@/components/TempleSplash";
import ScrollToTop from "@/components/ScrollToTop";
import { useState, useCallback } from "react";
import Index from "./pages/Index.tsx";
import Collections from "./pages/Collections.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import About from "./pages/About.tsx";
import Contact from "./pages/Contact.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import Checkout from "./pages/Checkout.tsx";
import Wishlist from "./pages/Wishlist.tsx";
import Orders from "./pages/Orders.tsx";
import Account from "./pages/Account.tsx";
import ProfilePage from "./pages/account/ProfilePage.tsx";
import AddressesPage from "./pages/account/AddressesPage.tsx";
import OrdersPage from "./pages/account/OrdersPage.tsx";
import WishlistPage from "./pages/account/WishlistPage.tsx";
import FAQ from "./pages/FAQ.tsx";
import Blog from "./pages/Blog.tsx";
import BlogPost from "./pages/BlogPost.tsx";
import AdminLogin from "./pages/admin/AdminLogin.tsx";
import AdminLayout from "./pages/admin/AdminLayout.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminProducts from "./pages/admin/AdminProducts.tsx";
import AdminCategories from "./pages/admin/AdminCategories.tsx";
import AdminOrders from "./pages/admin/AdminOrders.tsx";
import AdminUsers from "./pages/admin/AdminUsers.tsx";
import AdminSettings from "./pages/admin/AdminSettings.tsx";
import AdminContacts from "./pages/admin/AdminContacts.tsx";
import AdminMenu from "./pages/admin/AdminMenu.tsx";
import AdminCoupons from "./pages/admin/AdminCoupons.tsx";
import AdminShipping from "./pages/admin/AdminShipping.tsx";
import AdminTax from "./pages/admin/AdminTax.tsx";
import AdminBanners from "./pages/admin/AdminBanners.tsx";
import AdminReviews from "./pages/admin/AdminReviews.tsx";
import AdminFAQ from "./pages/admin/AdminFAQ.tsx";
import AdminBlog from "./pages/admin/AdminBlog.tsx";
import AdminTestimonials from "./pages/admin/AdminTestimonials.tsx";
import AdminNewsletter from "./pages/admin/AdminNewsletter.tsx";
import AdminReturns from "./pages/admin/AdminReturns.tsx";
import AdminAuditLog from "./pages/admin/AdminAuditLog.tsx";
import AdminPageSEO from "./pages/admin/AdminPageSEO.tsx";
import AdminHeroSlides from "./pages/admin/AdminHeroSlides.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import Terms from "./pages/Terms.tsx";
import ShippingPolicy from "./pages/ShippingPolicy.tsx";
import OrderConfirmation from "./pages/OrderConfirmation.tsx";
import ColorMatchingTool from "./pages/ColorMatchingTool.tsx";
import NotFound from "./pages/NotFound.tsx";

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
            <CartProvider>
              <CartDrawer />
              <WhatsAppButton />
              <MobileBottomNav />
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
            </CartProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
