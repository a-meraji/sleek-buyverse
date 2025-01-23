import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProductSelector } from "./ProductSelector";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ImageSection } from "./form/ImageSection";
import { DateSection } from "./form/DateSection";
import { StatusSection } from "./form/StatusSection";
import { CampaignFormData } from "./types";

interface CampaignFormProps {
  campaign?: any;
  onClose: () => void;
}

export function CampaignForm({ campaign, onClose }: CampaignFormProps) {
  const [showImageSelector, setShowImageSelector] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { register, handleSubmit, setValue, watch } = useForm<CampaignFormData>({
    defaultValues: {
      title: campaign?.title || "",
      description: campaign?.description || "",
      image_url: campaign?.image_url || "",
      start_date: campaign?.start_date ? new Date(campaign.start_date).toISOString().slice(0, 16) : "",
      end_date: campaign?.end_date ? new Date(campaign.end_date).toISOString().slice(0, 16) : "",
      status: campaign?.status === "active",
      selectedProducts: campaign?.campaign_products?.map((cp: any) => cp.product.id) || [],
    },
  });

  const { mutate: saveCampaign, isPending } = useMutation({
    mutationFn: async (data: CampaignFormData) => {
      const campaignData = {
        title: data.title,
        description: data.description,
        image_url: data.image_url,
        start_date: new Date(data.start_date).toISOString(),
        end_date: new Date(data.end_date).toISOString(),
        status: data.status ? "active" : "inactive",
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

      if (data.selectedProducts.length > 0) {
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

  const onSubmit = (data: CampaignFormData) => {
    saveCampaign(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="title">Campaign Title</Label>
        <Input id="title" {...register("title", { required: true })} />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description")} />
      </div>

      <ImageSection
        imageUrl={watch("image_url")}
        showImageSelector={showImageSelector}
        onImageSelect={(url) => setValue("image_url", url)}
        onShowImageSelector={setShowImageSelector}
      />

      <DateSection register={register} />

      <StatusSection
        value={watch("status")}
        onChange={(checked) => setValue("status", checked)}
      />

      <div>
        <Label>Products</Label>
        <ProductSelector
          selectedProducts={watch("selectedProducts")}
          onProductsChange={(products) => setValue("selectedProducts", products)}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {campaign ? "Update" : "Create"} Campaign
        </Button>
      </div>
    </form>
  );
}
