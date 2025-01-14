import { Footer } from "@/components/home/Footer";
import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/Navbar";

export const RootLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};