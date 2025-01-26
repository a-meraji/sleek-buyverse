import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProfileForm } from "@/components/navbar/ProfileForm";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
        toast({
          title: "Error",
          description: "Please log in to view your profile",
          variant: "destructive",
        });
        return;
      }
      setUserId(user?.id || null);
    };

    getUser();
  }, [toast]);

  if (!userId) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto py-10">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <ProfileForm userId={userId} />
          </TabsContent>
          <TabsContent value="orders">
            {/* TODO: Implement OrdersList component */}
            <div>Orders will be displayed here</div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}