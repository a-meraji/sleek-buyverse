import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Product from "./pages/Product";
import Products from "./pages/Products";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import About from "./pages/About";
import Profile from "./pages/Profile";
import ContactUs from "./pages/ContactUs";
import ShippingPolicy from "./pages/ShippingPolicy";
import ReturnsExchanges from "./pages/ReturnsExchanges";
import FAQ from "./pages/FAQ";
import { ChatButton } from "./components/chat/ChatButton";
import { CartProvider } from "./contexts/cart/CartContext";
import { RootLayout } from "./components/layout/RootLayout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<RootLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/about" element={<About />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/shipping" element={<ShippingPolicy />} />
              <Route path="/returns" element={<ReturnsExchanges />} />
              <Route path="/faq" element={<FAQ />} />
            </Route>
          </Routes>
          <ChatButton />
          <Toaster />
          <Sonner />
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;