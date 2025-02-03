import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { RootLayout } from "@/components/layout/RootLayout";
import Index from "@/pages/Index";
import Watch from "@/pages/Watch";
import About from "@/pages/About";
import Auth from "@/pages/Auth";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import ContactUs from "@/pages/ContactUs";
import FAQ from "@/pages/FAQ";
import Product from "@/pages/Product";
import Products from "@/pages/Products";
import Profile from "@/pages/Profile";
import ReturnsExchanges from "@/pages/ReturnsExchanges";
import ShippingPolicy from "@/pages/ShippingPolicy";
import Admin from "@/pages/Admin";
import CarouselsUI from "@/pages/CarouselsUI";
import Hero from "@/pages/Hero";
import BlogPost from "@/pages/BlogPost";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/watch" element={<Watch />} />
            <Route path="/carousels" element={<CarouselsUI />} />
            <Route path="/hero" element={<Hero />} />
            <Route path="/about" element={<About />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/products" element={<Products />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/returns-exchanges" element={<ReturnsExchanges />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
          </Route>
        </Routes>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;