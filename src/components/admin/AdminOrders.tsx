import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ORDER_STATUSES = ['pending', 'processing', 'shipped'] as const;
type OrderStatus = typeof ORDER_STATUSES[number];

export function AdminOrders() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      console.log('Fetching orders for admin dashboard');
      
      // First, fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
        throw ordersError;
      }

      // Then, for each order, fetch the user profile
      const ordersWithProfiles = await Promise.all(
        ordersData.map(async (order) => {
          if (!order.user_id) return { ...order, user: null };

          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", order.user_id)
            .single();

          return {
            ...order,
            user: profileData
          };
        })
      );

      console.log('Fetched orders with profiles:', ordersWithProfiles);
      return ordersWithProfiles;
    },
  });

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    console.log('Updating order status:', { orderId, newStatus });
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    }
  };

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
              {order.user?.first_name 
                ? `${order.user.first_name} ${order.user.last_name || ''}`
                : 'Unknown User'}
            </TableCell>
            <TableCell>
              <Select
                defaultValue={order.status}
                onValueChange={(value) => handleStatusChange(order.id, value as OrderStatus)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ORDER_STATUSES.map((status) => (
                    <SelectItem key={status} value={status} className="capitalize">
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
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