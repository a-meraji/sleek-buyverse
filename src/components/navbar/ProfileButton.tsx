import { useState } from "react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProfileForm } from "./ProfileForm";
import { FavoritesList } from "./FavoritesList";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProfileButtonProps {
  user: any;
  setUser: (user: any) => void;
}

export function ProfileButton({ user, setUser }: ProfileButtonProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const { toast } = useToast();

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
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsProfileOpen(true)}>
            Profile Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsFavoritesOpen(true)}>
            My Favorites
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Profile Settings</DialogTitle>
          </DialogHeader>
          <ProfileForm userId={user.id} onClose={() => setIsProfileOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isFavoritesOpen} onOpenChange={setIsFavoritesOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>My Favorites</DialogTitle>
          </DialogHeader>
          <FavoritesList userId={user.id} />
        </DialogContent>
      </Dialog>
    </>
  );
}