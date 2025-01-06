import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const reviewSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  review_text: z.string().min(10, "Review must be at least 10 characters"),
  rating: z.number().min(1).max(5),
  reviewer_first_name: z.string().min(1, "First name is required"),
  reviewer_last_name: z.string().min(1, "Last name is required"),
});

interface ReviewFormProps {
  onSubmit: (values: z.infer<typeof reviewSchema>) => void;
  onClose: () => void;
  defaultValues: {
    reviewer_first_name: string;
    reviewer_last_name: string;
  };
}

export const ReviewForm = ({ onSubmit, onClose, defaultValues }: ReviewFormProps) => {
  const form = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      ...defaultValues,
      title: "",
      review_text: "",
      rating: 0,
    },
  });

  return (
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
                      onClick={() => field.onChange(star)}
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
  );
};