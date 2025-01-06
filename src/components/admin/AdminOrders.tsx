import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { OrdersTable } from "./orders/OrdersTable";

export function AdminOrders() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      console.log('Fetching orders for admin dashboard');
      
      // First, fetch orders with their items and variants
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            id,
            quantity,
            price_at_time,
            product:products (
              name,
              image_url
            ),
            variant:product_variants (
              size,
              color
            )
          )
        `)
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

  if (isLoading) return <div>Loading...</div>;

  return <OrdersTable orders={orders || []} />;
}