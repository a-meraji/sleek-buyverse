import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export function AdminAnalytics() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      console.log("Fetching admin stats...");
      
      // Get total revenue from orders
      const { data: orders } = await supabase
        .from("orders")
        .select("total_amount");

      const totalRevenue = orders?.reduce(
        (sum, order) => sum + Number(order.total_amount),
        0
      ) || 0;

      // Get total products
      const { count: productsCount, error: productsError } = await supabase
        .from("products")
        .select("*", { count: 'exact', head: true });

      if (productsError) throw productsError;

      // Get total users from admin_users table
      const { count: usersCount, error: usersError } = await supabase
        .from("admin_users")
        .select("*", { count: 'exact', head: true });

      if (usersError) {
        console.error("Error fetching users count:", usersError);
        throw usersError;
      }

      console.log("Stats fetched successfully:", {
        totalRevenue,
        totalProducts: productsCount,
        totalUsers: usersCount
      });

      return {
        totalRevenue,
        totalProducts: productsCount || 0,
        totalUsers: usersCount || 0,
      };
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${stats?.totalRevenue.toFixed(2)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Products</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{stats?.totalProducts}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{stats?.totalUsers}</p>
        </CardContent>
      </Card>
    </div>
  );
}