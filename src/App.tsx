import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartDrawer } from "@/components/CartDrawer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
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
import AdminLogin from "./pages/admin/AdminLogin.tsx";
import AdminLayout from "./pages/admin/AdminLayout.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminProducts from "./pages/admin/AdminProducts.tsx";
import AdminCategories from "./pages/admin/AdminCategories.tsx";
import AdminOrders from "./pages/admin/AdminOrders.tsx";
import AdminUsers from "./pages/admin/AdminUsers.tsx";
import AdminSettings from "./pages/admin/AdminSettings.tsx";
import AdminContacts from "./pages/admin/AdminContacts.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import Terms from "./pages/Terms.tsx";
import ShippingPolicy from "./pages/ShippingPolicy.tsx";
import OrderConfirmation from "./pages/OrderConfirmation.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <CartDrawer />
            <WhatsAppButton />
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
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="contacts" element={<AdminContacts />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
