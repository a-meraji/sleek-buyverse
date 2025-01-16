import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { OrdersTable } from "./orders/OrdersTable";
import { OrderFilters } from "./orders/OrderFilters";
import { useState } from "react";
import { OrderStatus } from "./orders/OrderStatusSelect";
import { startOfDay, endOfDay } from "date-fns";

export function AdminOrders() {
  const [filters, setFilters] = useState({
    search: "",
    status: "pending" as OrderStatus | "all",
    dateRange: {
      from: undefined as Date | undefined,
      to: undefined as Date | undefined,
    },
    sortDirection: "desc" as "asc" | "desc",
  });

  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders", filters],
    queryFn: async () => {
      console.log('Fetching orders with filters:', filters);
      
      let query = supabase
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
              id,
              parameters,
              price
            )
          )
        `)
        .order('created_at', { ascending: filters.sortDirection === 'asc' });

      // Apply status filter
      if (filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      // Apply date range filter
      if (filters.dateRange.from) {
        query = query.gte('created_at', startOfDay(filters.dateRange.from).toISOString());
      }
      if (filters.dateRange.to) {
        query = query.lte('created_at', endOfDay(filters.dateRange.to).toISOString());
      }

      const { data: ordersData, error: ordersError } = await query;

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
        throw ordersError;
      }

      // Fetch user profiles for all orders
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

      // Apply search filter on client side (for both order ID and customer name)
      let filteredOrders = ordersWithProfiles;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredOrders = ordersWithProfiles.filter(
          (order) =>
            order.id.toLowerCase().includes(searchLower) ||
            (order.user?.first_name?.toLowerCase().includes(searchLower)) ||
            (order.user?.last_name?.toLowerCase().includes(searchLower))
        );
      }

      console.log('Filtered orders:', filteredOrders);
      return filteredOrders;
    },
  });

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <OrderFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />
      <OrdersTable 
        orders={orders || []} 
        sortDirection={filters.sortDirection}
        onSortChange={(direction) => setFilters({ ...filters, sortDirection: direction })}
      />
    </div>
  );
}