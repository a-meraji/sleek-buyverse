import { Button } from "@/components/ui/button";

interface FormActionsProps {
  isSubmitting: boolean;
  isEditing?: boolean;
}

export function FormActions({ isSubmitting, isEditing }: FormActionsProps) {
  return (
    <Button type="submit" disabled={isSubmitting}>
      {isSubmitting 
        ? (isEditing ? "Updating..." : "Creating...") 
        : (isEditing ? "Update Post" : "Create Post")}
    </Button>
  );
}