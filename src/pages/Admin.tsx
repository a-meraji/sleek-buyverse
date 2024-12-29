import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminProducts } from "@/components/admin/AdminProducts";
import { AdminOrders } from "@/components/admin/AdminOrders";
import { AdminUsers } from "@/components/admin/AdminUsers";
import { AdminAnalytics } from "@/components/admin/AdminAnalytics";
import { AdminChat } from "@/components/admin/AdminChat";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export default function Admin() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      // Check if user is admin@admin.com
      if (user.email === "admin@admin.com") {
        // Update user metadata to make them admin
        const { error: updateError } = await supabase.auth.updateUser({
          data: { is_admin: true }
        });

        if (updateError) {
          console.error("Error updating admin status:", updateError);
          toast({
            title: "Error",
            description: "Failed to update admin status",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Success",
          description: "Admin status updated successfully",
        });
      } else if (!user.user_metadata?.is_admin) {
        // If not admin@admin.com and not an admin, redirect to home
        navigate("/");
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page",
          variant: "destructive",
        });
      }
    };

    checkAdminStatus();
  }, [navigate, toast]);

  return (
    <div className="container mx-auto py-10">
      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>
        <TabsContent value="analytics" className="space-y-4">
          <AdminAnalytics />
        </TabsContent>
        <TabsContent value="products" className="space-y-4">
          <AdminProducts />
        </TabsContent>
        <TabsContent value="orders" className="space-y-4">
          <AdminOrders />
        </TabsContent>
        <TabsContent value="users" className="space-y-4">
          <AdminUsers />
        </TabsContent>
        <TabsContent value="chat" className="space-y-4">
          <AdminChat />
        </TabsContent>
      </Tabs>
    </div>
  );
}