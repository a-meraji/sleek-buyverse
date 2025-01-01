import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { SearchBar } from "./navbar/SearchBar";
import { NavigationMenu } from "./navbar/NavigationMenu";
import { ProfileButton } from "./navbar/ProfileButton";
import { useToast } from "@/hooks/use-toast";

export const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log("Initial session check:", { session, error });
      if (error) {
        console.error("Session check error:", error);
        toast({
          title: "Authentication Error",
          description: "Please sign in to access all features",
          variant: "destructive",
        });
      }
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", { event: _event, session });
      setUser(session?.user ?? null);
      
      if (_event === 'SIGNED_IN') {
        toast({
          title: "Welcome!",
          description: "You've successfully signed in",
        });
      } else if (_event === 'SIGNED_OUT') {
        toast({
          title: "Signed out",
          description: "You've been signed out successfully",
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

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
}