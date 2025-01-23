import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CampaignCard } from "./CampaignCard";
import { Loader2 } from "lucide-react";

interface CampaignListProps {
  status: 'active' | 'scheduled' | 'ended';
}

export function CampaignList({ status }: CampaignListProps) {
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['campaigns', status],
    queryFn: async () => {
      const now = new Date().toISOString();
      let query = supabase
        .from('marketing_campaigns')
        .select(`
          *,
          campaign_products (
            product:products (
              id,
              name,
              image_url,
              price
            )
          )
        `);

      switch (status) {
        case 'active':
          query = query.eq('status', 'active')
            .lte('start_date', now)
            .gte('end_date', now);
          break;
        case 'scheduled':
          query = query.eq('status', 'active')
            .gt('start_date', now);
          break;
        case 'ended':
          query = query.or(`status.eq.inactive,and(status.eq.active,end_date.lt.${now})`);
          break;
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!campaigns?.length) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No {status} campaigns found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map((campaign) => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}
    </div>
  );
}