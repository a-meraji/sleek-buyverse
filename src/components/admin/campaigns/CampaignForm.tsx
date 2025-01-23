import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ImageSection } from "./form/ImageSection";
import { DateSection } from "./form/DateSection";
import { StatusSection } from "./form/StatusSection";
import { CampaignFormData } from "./types";
import { CustomProductSelector } from "./product-selector/CustomProductSelector";
import { CampaignBasicInfo } from "./form/CampaignBasicInfo";
import { CampaignFormActions } from "./form/CampaignFormActions";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface CampaignFormProps {
  campaign?: any;
  onClose: () => void;
}

export function CampaignForm({ campaign, onClose }: CampaignFormProps) {
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [showProductSelector, setShowProductSelector] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  console.log('Initializing campaign form with:', campaign);

  const { register, handleSubmit, setValue, watch } = useForm<CampaignFormData>({
    defaultValues: {
      title: campaign?.title || "",
      description: campaign?.description || "",
      image_url: campaign?.image_url || "",
      start_date: campaign?.start_date ? new Date(campaign.start_date).toISOString().slice(0, 16) : "",
      end_date: campaign?.end_date ? new Date(campaign.end_date).toISOString().slice(0, 16) : "",
      status: campaign?.status === "active",
      is_timeless: campaign?.is_timeless || false,
      selectedProducts: campaign?.campaign_products?.map((cp: any) => cp.product.id) || [],
    },
  });

  const { mutate: saveCampaign, isPending } = useMutation({
    mutationFn: async (data: CampaignFormData) => {
      console.log('Saving campaign with data:', data);
      const campaignData = {
        title: data.title,
        description: data.description,
        image_url: data.image_url,
        start_date: new Date(data.start_date).toISOString(),
        end_date: new Date(data.end_date).toISOString(),
        status: data.status ? "active" : "inactive",
        is_timeless: data.is_timeless,
      };

      let campaignId = campaign?.id;

      if (campaign) {
        const { error: updateError } = await supabase
          .from('marketing_campaigns')
          .update(campaignData)
          .eq('id', campaign.id);
        if (updateError) throw updateError;
      } else {
        const { data: newCampaign, error: insertError } = await supabase
          .from('marketing_campaigns')
          .insert(campaignData)
          .select()
          .single();
        if (insertError) throw insertError;
        campaignId = newCampaign.id;
      }

      // Handle campaign products
      if (campaign) {
        const { error: deleteError } = await supabase
          .from('campaign_products')
          .delete()
          .eq('campaign_id', campaignId);
        if (deleteError) throw deleteError;
      }

      if (data.selectedProducts && data.selectedProducts.length > 0) {
        const campaignProducts = data.selectedProducts.map((productId: string) => ({
          campaign_id: campaignId,
          product_id: productId,
        }));

        const { error: productsError } = await supabase
          .from('campaign_products')
          .insert(campaignProducts);
        if (productsError) throw productsError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast({
        title: campaign ? "Campaign updated" : "Campaign created",
        description: `The campaign has been successfully ${campaign ? "updated" : "created"}.`,
      });
      onClose();
    },
    onError: (error) => {
      console.error('Error saving campaign:', error);
      toast({
        title: "Error",
        description: `Failed to ${campaign ? "update" : "create"} the campaign. Please try again.`,
        variant: "destructive",
      });
    },
  });

  const selectedProducts = watch("selectedProducts");
  const isTimeless = watch("is_timeless");

  const onSubmitHandler = handleSubmit((data) => {
    saveCampaign(data);
  });

  return (
    <form onSubmit={onSubmitHandler} className="space-y-6">
      <CampaignBasicInfo register={register} />

      <ImageSection
        imageUrl={watch("image_url")}
        showImageSelector={showImageSelector}
        onImageSelect={(url) => setValue("image_url", url)}
        onShowImageSelector={setShowImageSelector}
      />

      <div className="flex items-center space-x-2 mb-4">
        <Switch
          id="is_timeless"
          checked={isTimeless}
          onCheckedChange={(checked) => setValue("is_timeless", checked)}
        />
        <Label htmlFor="is_timeless">Timeless Campaign</Label>
      </div>

      {!isTimeless && (
        <DateSection register={register} />
      )}

      <StatusSection
        value={watch("status")}
        onChange={(checked) => setValue("status", checked)}
      />

      <div>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between"
          onClick={() => setShowProductSelector(true)}
        >
          {selectedProducts.length > 0
            ? `${selectedProducts.length} products selected`
            : "Select products..."}
        </Button>

        <CustomProductSelector
          selectedProducts={selectedProducts}
          onProductsChange={(products) => {
            console.log('Updating selected products:', products);
            setValue("selectedProducts", products);
          }}
          isOpen={showProductSelector}
          onClose={() => setShowProductSelector(false)}
        />
      </div>

      <CampaignFormActions 
        onClose={onClose}
        isPending={isPending}
        isEditing={!!campaign}
      />
    </form>
  );
}