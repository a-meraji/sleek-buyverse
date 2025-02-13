export type CampaignFormData = {
  title: string;
  description: string;
  image_url: string;
  start_date: string;
  end_date: string;
  status: boolean;
  is_timeless: boolean;
  selectedProducts: string[];
};