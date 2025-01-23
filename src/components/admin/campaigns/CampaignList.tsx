import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CampaignCard } from "./CampaignCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";

type TabValue = 'active' | 'inactive' | 'ended';

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
          // Active campaigns are:
          // 1. Active status AND either:
          //    a. Timeless campaigns
          //    b. Non-timeless campaigns within their date range
          query = query
            .eq('status', 'active')
            .or(`is_timeless.eq.true,and(is_timeless.eq.false,start_date.lte.${now},end_date.gte.${now})`);
          break;
        case 'inactive':
          // Inactive (draft) campaigns
          query = query.eq('status', 'inactive');
          break;
        case 'ended':
          // Ended campaigns are:
          // Active, non-timeless campaigns that have passed their end date
          query = query
            .eq('status', 'active')
            .eq('is_timeless', false)
            .lt('end_date', now);
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
    <div className="space-y-4">
      <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as TabValue)} className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
          <TabsTrigger value="ended">Ended</TabsTrigger>
        </TabsList>
      </Tabs>

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
    </div>
  );
}