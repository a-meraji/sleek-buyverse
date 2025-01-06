import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollArea } from "@/components/ui/scroll-area";

const reviewSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  review_text: z.string().min(10, "Review must be at least 10 characters"),
  rating: z.number().min(1).max(5),
  reviewer_first_name: z.string().min(1, "First name is required"),
  reviewer_last_name: z.string().min(1, "Last name is required"),
});

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
  const [rating, setRating] = useState(0);
  const [profileData, setProfileData] = useState<any>(null);

  const form = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      ...defaultValues,
      title: "",
      review_text: "",
      rating: 0,
    },
  });

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
          form.setValue('reviewer_first_name', profile.first_name || '');
          form.setValue('reviewer_last_name', profile.last_name || '');
        }
      }
    };

    if (isOpen) {
      fetchProfileData();
    }
  }, [isOpen, form]);

  const onSubmit = async (values: z.infer<typeof reviewSchema>) => {
    try {
      const { error } = await supabase.from("reviews").insert({
        product_id: productId,
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="reviewer_first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reviewer_last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Brief summary of your review" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="review_text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Review</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Share your experience with this product"
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <FormControl>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`cursor-pointer ${
                              star <= field.value ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                            onClick={() => {
                              field.onChange(star);
                              setRating(star);
                            }}
                          />
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">Submit Review</Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};