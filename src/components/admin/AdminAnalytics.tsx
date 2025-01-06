import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { StatsCards } from "./analytics/StatsCards";
import { RevenueChart } from "./analytics/RevenueChart";
import { UserSignupsChart } from "./analytics/UserSignupsChart";
import { TrafficChart } from "./analytics/TrafficChart";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";

export function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState("7"); // Default to 7 days
  const [customDateRange, setCustomDateRange] = useState<{
    from?: Date;
    to?: Date;
  }>({});

  const { data: stats, isLoading } = useQuery({
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

  const clearCustomDateRange = () => {
    setCustomDateRange({});
    setTimeRange("7");
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-4 gap-4">
        <Select 
          value={timeRange} 
          onValueChange={(value) => {
            setTimeRange(value);
            setCustomDateRange({});
          }}
          disabled={!!(customDateRange.from && customDateRange.to)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="180">Last 180 days</SelectItem>
            <SelectItem value="365">Last 365 days</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`justify-start text-left font-normal ${
                  !customDateRange.from && "text-muted-foreground"
                }`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {customDateRange.from ? (
                  customDateRange.to ? (
                    <>
                      {format(customDateRange.from, "LLL dd, y")} -{" "}
                      {format(customDateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(customDateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Custom date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={customDateRange.from}
                selected={{
                  from: customDateRange.from,
                  to: customDateRange.to,
                }}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    setCustomDateRange(range);
                    setTimeRange("");
                  }
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          {(customDateRange.from || customDateRange.to) && (
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={clearCustomDateRange}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
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