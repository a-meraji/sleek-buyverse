import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ReviewForm } from "./review/ReviewForm";

interface ReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  defaultValues: {
    reviewer_first_name: string;
    reviewer_last_name: string;
  };
}

export const ReviewDialog = ({ isOpen, onClose, productId, defaultValues }: ReviewDialogProps) => {
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, phone')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }

        if (profile) {
          setProfileData(profile);
        }
      }
    };

    if (isOpen) {
      fetchProfileData();
    }
  }, [isOpen]);

  const handleSubmit = async (values: any) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase.from("reviews").insert({
        product_id: productId,
        reviewer_id: session.user.id,
        ...values,
      });

      if (error) throw error;

      toast({
        title: "Review submitted",
        description: "Your review has been submitted and is pending approval.",
      });

      onClose();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[95vh] p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Write a Review</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(95vh-8rem)] px-6 pb-6">
          <ReviewForm
            onSubmit={handleSubmit}
            onClose={onClose}
            defaultValues={{
              reviewer_first_name: profileData?.first_name || defaultValues.reviewer_first_name,
              reviewer_last_name: profileData?.last_name || defaultValues.reviewer_last_name,
            }}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};