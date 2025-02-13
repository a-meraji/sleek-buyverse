import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export const NavigationMenu = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <div className="mt-4 flex flex-col gap-2">
          <Link to="/" className="p-2 hover:bg-accent rounded-md">
            Home
          </Link>
          <Link to="/products" className="p-2 hover:bg-accent rounded-md">
            Products
          </Link>
          <Link to="/cart" className="p-2 hover:bg-accent rounded-md">
            Cart
          </Link>
          <Link to="/about" className="p-2 hover:bg-accent rounded-md">
            About
          </Link>
          <Link to="/faq" className="p-2 hover:bg-accent rounded-md">
            FAQ
          </Link>
          <Link to="/contact-us" className="p-2 hover:bg-accent rounded-md">
            Contact Us
          </Link>
          <Link to="/shipping-policy" className="p-2 hover:bg-accent rounded-md">
            Shipping Policy
          </Link>
          <Link to="/returns-exchanges" className="p-2 hover:bg-accent rounded-md">
            Returns & Exchanges
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
};