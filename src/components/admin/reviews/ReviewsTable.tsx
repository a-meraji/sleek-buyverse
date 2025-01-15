import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Review } from "@/types";
import { ReviewStatusSelect } from "./ReviewStatusSelect";
import { Button } from "@/components/ui/button";
import { AlertCircle, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

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
    setReviewToDelete(null);
  };

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <AlertCircle className="h-12 w-12 mb-4" />
        <p className="text-lg">No reviews in {reviews[0]?.status || 'selected'} status to view.</p>
      </div>
    );
  }

  return (
    <>
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
                  onClick={() => setReviewToDelete(review.id)}
                >
                  <Trash className="h-4 w-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={!!reviewToDelete} onOpenChange={() => setReviewToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the review.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => reviewToDelete && handleDelete(reviewToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}