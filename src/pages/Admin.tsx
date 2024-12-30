import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminProducts } from "@/components/admin/AdminProducts";
import { AdminOrders } from "@/components/admin/AdminOrders";
import { AdminUsers } from "@/components/admin/AdminUsers";
import { AdminAnalytics } from "@/components/admin/AdminAnalytics";
import { AdminChat } from "@/components/admin/AdminChat";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAdmin } from "@/hooks/useAdmin";

export default function Admin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: adminStatus, isLoading } = useAdmin();

  useEffect(() => {
    if (!isLoading && !adminStatus?.isAdmin) {
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
