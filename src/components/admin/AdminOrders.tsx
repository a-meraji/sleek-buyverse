import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";

export function AdminOrders() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      // First get orders
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*, user_id");

      if (ordersError) throw ordersError;

      // Then get profiles for these orders
      const userIds = ordersData.map(order => order.user_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, email, full_name")
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Combine the data
      const ordersWithProfiles = ordersData.map(order => ({
        ...order,
        profile: profilesData.find(profile => profile.id === order.user_id)
      }));

      return ordersWithProfiles;
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Total Amount</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders?.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{order.id.slice(0, 8)}</TableCell>
            <TableCell>
              {order.profile?.full_name || order.profile?.email || 'Unknown User'}
            </TableCell>
            <TableCell className="capitalize">{order.status}</TableCell>
            <TableCell>${order.total_amount}</TableCell>
            <TableCell>
              {new Date(order.created_at).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}