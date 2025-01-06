import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { StatsCards } from "./analytics/StatsCards";
import { RevenueChart } from "./analytics/RevenueChart";
import { UserSignupsChart } from "./analytics/UserSignupsChart";
import { TrafficChart } from "./analytics/TrafficChart";

export function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState("7"); // Default to 7 days

  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats", timeRange],
    queryFn: async () => {
      console.log("Fetching admin stats for last", timeRange, "days");
      
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(timeRange));

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

      console.log("Stats fetched successfully:", {
        totalRevenue,
        totalProducts: productsCount,
        totalUsers: usersCount,
        dailyRevenue,
        dailySignups,
        dailyVisits
      });

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

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <StatsCards 
        totalRevenue={stats?.totalRevenue || 0}
        totalProducts={stats?.totalProducts || 0}
        totalUsers={stats?.totalUsers || 0}
      />

      <RevenueChart data={stats?.dailyRevenue || []} />
      <UserSignupsChart data={stats?.dailySignups || []} />
      <TrafficChart data={stats?.dailyVisits || []} />
    </div>
  );
}