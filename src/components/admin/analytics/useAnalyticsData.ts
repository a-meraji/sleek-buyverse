import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface AnalyticsDataParams {
  timeRange: string;
  customDateRange: {
    from?: Date;
    to?: Date;
  };
}

export function useAnalyticsData({ timeRange, customDateRange }: AnalyticsDataParams) {
  return useQuery({
    queryKey: ["admin-stats", timeRange, customDateRange],
    queryFn: async () => {
      console.log("Fetching admin stats with timeRange:", timeRange, "and customDateRange:", customDateRange);
      
      let startDate: Date;
      let endDate = new Date();

      if (customDateRange.from && customDateRange.to) {
        startDate = customDateRange.from;
        endDate = customDateRange.to;
      } else {
        startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(timeRange));
      }

      // Get orders within date range
      const { data: orders } = await supabase
        .from("orders")
        .select("total_amount, created_at")
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString())
        .order("created_at", { ascending: true });

      // Get total revenue
      const totalRevenue = orders?.reduce(
        (sum, order) => sum + Number(order.total_amount),
        0
      ) || 0;

      // Get daily revenue data
      const dailyRevenue = orders?.reduce((acc: any[], order) => {
        const date = new Date(order.created_at).toLocaleDateString();
        const existingDay = acc.find(day => day.date === date);
        
        if (existingDay) {
          existingDay.revenue += Number(order.total_amount);
        } else {
          acc.push({ date, revenue: Number(order.total_amount) });
        }
        return acc;
      }, []) || [];

      // Get user signups within date range
      const { data: userSignups } = await supabase
        .from("profiles")
        .select("created_at")
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString())
        .order("created_at", { ascending: true });

      // Get daily user signups
      const dailySignups = userSignups?.reduce((acc: any[], signup) => {
        const date = new Date(signup.created_at).toLocaleDateString();
        const existingDay = acc.find(day => day.date === date);
        
        if (existingDay) {
          existingDay.users += 1;
        } else {
          acc.push({ date, users: 1 });
        }
        return acc;
      }, []) || [];

      // Get site visits within date range
      const { data: siteVisits } = await supabase
        .from("site_visits")
        .select("visited_at")
        .gte("visited_at", startDate.toISOString())
        .lte("visited_at", endDate.toISOString())
        .order("visited_at", { ascending: true });

      // Get daily site visits
      const dailyVisits = siteVisits?.reduce((acc: any[], visit) => {
        const date = new Date(visit.visited_at).toLocaleDateString();
        const existingDay = acc.find(day => day.date === date);
        
        if (existingDay) {
          existingDay.visits += 1;
        } else {
          acc.push({ date, visits: 1 });
        }
        return acc;
      }, []) || [];

      // Get total counts
      const { count: productsCount } = await supabase
        .from("products")
        .select("*", { count: 'exact', head: true });

      const { count: usersCount } = await supabase
        .from("profiles")
        .select("*", { count: 'exact', head: true });

      return {
        totalRevenue,
        totalProducts: productsCount || 0,
        totalUsers: usersCount || 0,
        dailyRevenue,
        dailySignups,
        dailyVisits
      };
    },
  });
}