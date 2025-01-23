import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CampaignForm } from "./CampaignForm";

interface CampaignCardProps {
  campaign: any;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: deleteCampaign } = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('marketing_campaigns')
        .delete()
        .eq('id', campaign.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast({
        title: "Campaign deleted",
        description: "The campaign has been successfully deleted.",
      });
    },
    onError: (error) => {
      console.error('Error deleting campaign:', error);
      toast({
        title: "Error",
        description: "Failed to delete the campaign. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = () => {
    const now = new Date();
    const startDate = new Date(campaign.start_date);
    const endDate = new Date(campaign.end_date);

    if (campaign.status === 'inactive') {
      return <Badge variant="secondary">Inactive</Badge>;
    }

    if (now < startDate) {
      return <Badge variant="secondary">Scheduled</Badge>;
    }

    if (now > endDate) {
      return <Badge variant="secondary">Ended</Badge>;
    }

    return <Badge variant="default">Active</Badge>;
  };

  return (
    <>
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">{campaign.title}</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowEditDialog(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {getStatusBadge()}
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-sm text-muted-foreground">{campaign.description}</div>
          <div className="space-y-1">
            <div className="text-sm">
              Starts: {formatDistanceToNow(new Date(campaign.start_date), { addSuffix: true })}
            </div>
            <div className="text-sm">
              Ends: {formatDistanceToNow(new Date(campaign.end_date), { addSuffix: true })}
            </div>
          </div>
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Included Products</h4>
            <div className="flex flex-wrap gap-2">
              {campaign.campaign_products?.map((cp: any) => (
                <Badge key={cp.product.id} variant="outline">
                  {cp.product.name}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this campaign? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteCampaign()}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <CampaignForm campaign={campaign} onClose={() => setShowEditDialog(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}