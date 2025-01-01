import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "./navbar/SearchBar";
import { NavigationMenu } from "./navbar/NavigationMenu";
import { ProfileButton } from "./navbar/ProfileButton";
import { useAuthStatus } from "@/hooks/useAuthStatus";

export const Navbar = () => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const { user, setUser } = useAuthStatus();

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-semibold">
            Store
          </Link>
          <SearchBar 
            isExpanded={isSearchExpanded}
            setIsExpanded={setIsSearchExpanded}
          />
        </div>
        
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden"
            onClick={() => setIsSearchExpanded(true)}
          >
            <Search className="h-5 w-5" />
          </Button>
          <Link to="/cart">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </Link>
          
          <ProfileButton user={user} setUser={setUser} />
          <NavigationMenu />
        </div>
      </div>
    </nav>
  );
};