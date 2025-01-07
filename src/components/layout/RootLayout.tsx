import { Footer } from "@/components/home/Footer";
import { Outlet } from "react-router-dom";
import { CartDrawer } from "@/components/cart/CartDrawer";

export const RootLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1">
        <Outlet />
      </div>
      <CartDrawer />
      <Footer />
    </div>
  );
};