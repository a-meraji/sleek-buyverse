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
        .select('*')
        .order('created_at', { ascending: false });

      switch (selectedTab) {
        case 'active':
          query = query
            .eq('status', 'active')
            .lte('start_date', now)
            .gte('end_date', now);
          break;
        case 'scheduled':
          query = query.or(
            `status.eq.inactive,and(status.eq.active,start_date.gt.${now})`
          );
          break;
        case 'ended':
          query = query
            .eq('status', 'active')
            .lt('end_date', now);
          break;
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching campaigns:', error);
        throw error;
      }

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