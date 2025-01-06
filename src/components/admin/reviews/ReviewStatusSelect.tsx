import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface ReviewStatusSelectProps {
  reviewId: string;
  currentStatus: "pending" | "approved" | "rejected";
}

export function ReviewStatusSelect({ reviewId, currentStatus }: ReviewStatusSelectProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleStatusChange = async (newStatus: string) => {
    console.log("Updating review status:", { reviewId, newStatus });
    const { error } = await supabase
      .from("reviews")
      .update({ status: newStatus })
      .eq("id", reviewId);

    if (error) {
      console.error("Error updating review status:", error);
      toast({
        title: "Error",
        description: "Failed to update review status",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Review status updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    }
  };

  return (
    <Select defaultValue={currentStatus} onValueChange={handleStatusChange}>
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-white dark:bg-gray-800">
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="approved">Approved</SelectItem>
        <SelectItem value="rejected">Rejected</SelectItem>
      </SelectContent>
    </Select>
  );
}