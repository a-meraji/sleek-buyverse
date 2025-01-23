import { useState } from "react";
import { CampaignList } from "./campaigns/CampaignList";
import { CampaignAnalytics } from "./campaigns/CampaignAnalytics";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CampaignForm } from "./campaigns/CampaignForm";

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

      <CampaignList />

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Campaign Analytics</h3>
        <CampaignAnalytics />
      </div>

      <Dialog open={showNewCampaignDialog} onOpenChange={setShowNewCampaignDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <CampaignForm onClose={() => setShowNewCampaignDialog(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}