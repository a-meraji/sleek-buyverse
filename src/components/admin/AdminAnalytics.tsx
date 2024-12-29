import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export function AdminAnalytics() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
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

      // Get total users
      const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();

      if (usersError) throw usersError;

      return {
        totalRevenue,
        totalProducts: productsCount || 0,
        totalUsers: users?.length || 0,
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