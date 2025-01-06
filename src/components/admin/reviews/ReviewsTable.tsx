import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Review } from "@/types";
import { ReviewStatusSelect } from "./ReviewStatusSelect";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface ReviewsTableProps {
  reviews: (Review & {
    product: {
      name: string;
    };
  })[];
}

export function ReviewsTable({ reviews }: ReviewsTableProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = async (reviewId: string) => {
    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", reviewId);

    if (error) {
      console.error("Error deleting review:", error);
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Review deleted successfully",
    });
    queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Reviewer</TableHead>
          <TableHead>Rating</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Review</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reviews.map((review) => (
          <TableRow key={review.id}>
            <TableCell>{review.product.name}</TableCell>
            <TableCell>
              {review.reviewer_first_name} {review.reviewer_last_name}
            </TableCell>
            <TableCell>{review.rating}/5</TableCell>
            <TableCell>{review.title}</TableCell>
            <TableCell className="max-w-md">
              <p className="truncate">{review.review_text}</p>
            </TableCell>
            <TableCell>
              <ReviewStatusSelect reviewId={review.id} currentStatus={review.status} />
            </TableCell>
            <TableCell>{new Date(review.created_at).toLocaleDateString()}</TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(review.id)}
              >
                <Trash className="h-4 w-4 text-destructive" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}