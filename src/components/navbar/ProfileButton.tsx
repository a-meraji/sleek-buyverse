import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";

interface ProfileButtonProps {
  user: any;
  setUser: (user: any) => void;
}

export function ProfileButton({ user, setUser }: ProfileButtonProps) {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      localStorage.clear();
      setUser(null);
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      
      window.location.replace('/');
    } catch (err) {
      console.error("Error signing out:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <Link to="/profile">
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end"
        className="bg-white dark:bg-gray-800 border shadow-lg z-50"
      >
        <DropdownMenuLabel className="text-gray-900 dark:text-gray-100">
          {user.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
        <DropdownMenuItem 
          onClick={() => navigate('/profile')}
          className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
        >
          Profile Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}