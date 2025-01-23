import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageSelector } from "../ImageSelector";
import { ProductSelector } from "./ProductSelector";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

interface CampaignFormProps {
  campaign?: any;
  onClose: () => void;
}

type CampaignFormData = {
  title: string;
  description: string;
  image_url: string;
  start_date: string;
  end_date: string;
  status: boolean;
  selectedProducts: string[];
};

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

  const handleImageSelect = (url: string) => {
    setValue("image_url", url);
    setShowImageSelector(false);
  };

  const imageUrl = watch("image_url");

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

      <div>
        <Label>Campaign Image</Label>
        <div className="mt-2 space-y-2">
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Campaign"
              className="w-full h-48 object-cover rounded-lg"
            />
          )}
          <Button type="button" onClick={() => setShowImageSelector(true)}>
            {imageUrl ? "Change Image" : "Select Image"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start_date">Start Date</Label>
          <Input
            id="start_date"
            type="datetime-local"
            {...register("start_date", { required: true })}
          />
        </div>
        <div>
          <Label htmlFor="end_date">End Date</Label>
          <Input
            id="end_date"
            type="datetime-local"
            {...register("end_date", { required: true })}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="status"
          checked={watch("status")}
          onCheckedChange={(checked) => setValue("status", checked)}
        />
        <Label htmlFor="status">Active Campaign</Label>
      </div>

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

      <ImageSelector
        open={showImageSelector}
        onClose={() => setShowImageSelector(false)}
        onSelect={handleImageSelect}
      />
    </form>
  );
}