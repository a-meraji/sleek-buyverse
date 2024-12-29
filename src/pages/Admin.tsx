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
import { useQuery } from "@tanstack/react-query";

export default function Admin() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check admin status using the admin_users table
  const { data: adminStatus, isLoading } = useQuery({
    queryKey: ["admin-status"],
    queryFn: async () => {
      console.log("Checking admin status...");
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log("No session found");
        return { isAdmin: false, role: null };
      }

      // Query the admin_users table
      const { data: adminUser, error } = await supabase
        .from("admin_users")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Error checking admin status:", error);
        return { isAdmin: false, role: null };
      }

      console.log("Admin status:", adminUser);
      return {
        isAdmin: adminUser?.role === "admin" || adminUser?.role === "super_admin",
        role: adminUser?.role
      };
    },
  });

  useEffect(() => {
    if (!isLoading && !adminStatus?.isAdmin) {
      console.log("Access denied - not an admin");
      navigate("/");
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page",
        variant: "destructive",
      });
    }
  }, [adminStatus, isLoading, navigate, toast]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!adminStatus?.isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Role: {adminStatus.role || "Unknown"}
        </p>
      </div>
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