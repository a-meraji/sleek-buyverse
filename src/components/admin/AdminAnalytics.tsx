import { useState } from "react";
import { StatsCards } from "./analytics/StatsCards";
import { RevenueChart } from "./analytics/RevenueChart";
import { UserSignupsChart } from "./analytics/UserSignupsChart";
import { TrafficChart } from "./analytics/TrafficChart";
import { TimeRangeControls } from "./analytics/TimeRangeControls";
import { useAnalyticsData } from "./analytics/useAnalyticsData";

export function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState("7"); // Default to 7 days
  const [customDateRange, setCustomDateRange] = useState<{
    from?: Date;
    to?: Date;
  }>({});

  const { data: stats, isLoading } = useAnalyticsData({
    timeRange,
    customDateRange,
  });

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    setCustomDateRange({});
  };

  const handleCustomDateRangeChange = (range: { from?: Date; to?: Date }) => {
    setCustomDateRange(range);
    setTimeRange("");
  };

  const clearCustomDateRange = () => {
    setCustomDateRange({});
    setTimeRange("7");
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <TimeRangeControls
        timeRange={timeRange}
        customDateRange={customDateRange}
        onTimeRangeChange={handleTimeRangeChange}
        onCustomDateRangeChange={handleCustomDateRangeChange}
        onClearCustomDateRange={clearCustomDateRange}
      />

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