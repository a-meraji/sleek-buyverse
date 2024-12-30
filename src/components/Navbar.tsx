import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { SearchBar } from "./navbar/SearchBar";
import { NavigationMenu } from "./navbar/NavigationMenu";
import { AuthButtons } from "./navbar/AuthButtons";

export const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session);
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", { event: _event, session });
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
          
          <AuthButtons user={user} setUser={setUser} />
           <NavigationMenu />
        </div>
      </div>
    </nav>
  );
};
