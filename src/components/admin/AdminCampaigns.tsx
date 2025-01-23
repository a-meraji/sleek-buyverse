import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CampaignList } from "./campaigns/CampaignList";
import { CampaignAnalytics } from "./campaigns/CampaignAnalytics";
import { CampaignForm } from "./campaigns/CampaignForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export function AdminCampaigns() {
  const [showNewCampaignDialog, setShowNewCampaignDialog] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Marketing Campaigns</h2>
        <Button onClick={() => setShowNewCampaignDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Campaign
        </Button>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Campaigns</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="ended">Ended</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <CampaignList status="active" />
        </TabsContent>
        
        <TabsContent value="scheduled">
          <CampaignList status="scheduled" />
        </TabsContent>
        
        <TabsContent value="ended">
          <CampaignList status="ended" />
        </TabsContent>

        <TabsContent value="analytics">
          <CampaignAnalytics />
        </TabsContent>
      </Tabs>

      <Dialog open={showNewCampaignDialog} onOpenChange={setShowNewCampaignDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <CampaignForm onClose={() => setShowNewCampaignDialog(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}