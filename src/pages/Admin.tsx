import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminProducts } from "@/components/admin/AdminProducts";
import { AdminOrders } from "@/components/admin/AdminOrders";
import { AdminUsers } from "@/components/admin/AdminUsers";
import { AdminAnalytics } from "@/components/admin/AdminAnalytics";
import { AdminChat } from "@/components/admin/AdminChat";
import { AdminReviews } from "@/components/admin/AdminReviews";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/hooks/useAdmin";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Store } from "lucide-react";
import { useUnreadAdminMessages } from "@/components/admin/chat/hooks/useUnreadAdminMessages";

export default function Admin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: adminStatus, isLoading } = useAdmin();
  const { data: unreadMessages = 0 } = useUnreadAdminMessages();

  const { data: pendingReviewsCount } = useQuery({
    queryKey: ["pending-reviews-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("reviews")
        .select("*", { count: 'exact', head: true })
        .eq("status", "pending");

      if (error) throw error;
      return count || 0;
    },
  });

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
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Role: {adminStatus.role || "Unknown"}
          </p>
        </div>
        <Link to="/">
          <Button variant="outline" className="gap-2">
            <Store className="h-4 w-4" />
            Go to Store
          </Button>
        </Link>
      </div>
      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="reviews" className="relative">
            Reviews
            {pendingReviewsCount > 0 && (
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-blue-500" />
            )}
          </TabsTrigger>
          <TabsTrigger value="chat" className="relative">
            Chat
            {unreadMessages > 0 && (
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-blue-500" />
            )}
          </TabsTrigger>
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
        <TabsContent value="reviews" className="space-y-4">
          <AdminReviews />
        </TabsContent>
        <TabsContent value="chat" className="space-y-4">
          <AdminChat />
        </TabsContent>
      </Tabs>
    </div>
  );
}