import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CampaignCard } from "./CampaignCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";

type TabValue = 'all' | 'active' | 'scheduled' | 'ended';

export function CampaignList() {
  const [selectedTab, setSelectedTab] = useState<TabValue>('active');

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['campaigns', selectedTab],
    queryFn: async () => {
      const now = new Date().toISOString();
      let query = supabase
        .from('marketing_campaigns')
        .select('*, campaign_products(product:products(*))')
        .order('created_at', { ascending: false });

      switch (selectedTab) {
        case 'active':
          // Active campaigns are either:
          // 1. Timeless and active
          // 2. Within their date range and active
          query = query
            .eq('status', 'active')
            .or(`is_timeless.eq.true,and(start_date.lte.${now},end_date.gte.${now})`);
          break;
        case 'scheduled':
          // Scheduled campaigns are:
          // 1. Inactive (draft) campaigns
          // 2. Active campaigns that haven't started yet (excluding timeless)
          query = query
            .or(
              `status.eq.inactive,and(status.eq.active,is_timeless.eq.false,start_date.gt.${now})`
            );
          break;
        case 'ended':
          // Ended campaigns are:
          // Non-timeless campaigns that have passed their end date
          query = query
            .eq('status', 'active')
            .eq('is_timeless', false)
            .lt('end_date', now);
          break;
        case 'all':
          // No additional filters for 'all' tab
          break;
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching campaigns:', error);
        throw error;
      }

      console.log('Fetched campaigns for tab:', selectedTab, data);
      return data;
    }
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="grid gap-4">
      {campaigns?.map((campaign) => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}
      {campaigns?.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          No campaigns found
        </p>
      )}
    </div>
  );
}