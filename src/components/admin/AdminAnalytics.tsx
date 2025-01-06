import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useState } from "react";

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
        dailySignups
      });

      return {
        totalRevenue,
        totalProducts: productsCount || 0,
        totalUsers: usersCount || 0,
        dailyRevenue,
        dailySignups
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

      <Card>
        <CardHeader>
          <CardTitle>Revenue Over Time</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats?.dailyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#8884d8" 
                name="Revenue ($)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>New Users Over Time</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats?.dailySignups}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="#82ca9d" 
                name="New Users"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}