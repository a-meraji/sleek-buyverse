import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Campaign {
  id: string;
  title: string;
  description: string;
  image_url: string;
  is_timeless: boolean;
  end_date: string;
  campaign_products: {
    product: {
      id: string;
      name: string;
      image_url: string;
      product_variants: any[];
      discount?: number;
      price: number; // Added price field
    };
  }[];
}

export function CampaignBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ['active-campaigns'],
    queryFn: async () => {
      console.log('Fetching active campaigns');
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('marketing_campaigns')
        .select(`
          *,
          campaign_products(
            product(
              id,
              name,
              image_url,
              discount,
              product_variants(*)
            )
          )
        `)
        .eq('status', 'active')
        .or(`is_timeless.eq.true,and(is_timeless.eq.false,end_date.gte.${now})`);

      if (error) {
        console.error('Error fetching campaigns:', error);
        throw error;
      }

      // Transform the data to include a default price if needed
      const transformedData = data.map(campaign => ({
        ...campaign,
        campaign_products: campaign.campaign_products.map(cp => ({
          ...cp,
          product: {
            ...cp.product,
            // Set price as the minimum price from variants or 0 if no variants
            price: cp.product.product_variants?.length > 0
              ? Math.min(...cp.product.product_variants.map(v => v.price))
              : 0
          }
        }))
      }));

      console.log('Fetched campaigns:', transformedData);
      return transformedData as Campaign[];
    },
  });

  useEffect(() => {
    if (campaigns.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % campaigns.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [campaigns.length]);

  if (isLoading || campaigns.length === 0) return null;

  const campaign = campaigns[currentIndex];
  const products = campaign.campaign_products.map(cp => cp.product);
  const timeLeft = !campaign.is_timeless && campaign.end_date
    ? formatDistanceToNow(new Date(campaign.end_date), { addSuffix: true })
    : null;

  return (
    <section className="relative">
      {/* Campaign Banner */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <img
          src={campaign.image_url}
          alt={campaign.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white max-w-2xl px-4">
            <h2 className="text-4xl font-bold mb-4">{campaign.title}</h2>
            <p className="text-xl mb-4">{campaign.description}</p>
            {timeLeft && (
              <p className="text-lg font-semibold">
                Ends {timeLeft}
              </p>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        {campaigns.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={() => setCurrentIndex((prev) => (prev - 1 + campaigns.length) % campaigns.length)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={() => setCurrentIndex((prev) => (prev + 1) % campaigns.length)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Dots Navigation */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {campaigns.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    currentIndex === index ? "bg-white" : "bg-white/50"
                  }`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Related Products */}
      {products.length > 0 && (
        <div className="py-8">
          <ProductCarousel
            title="Campaign Products"
            products={products}
          />
        </div>
      )}
    </section>
  );
}