import { Button } from "@/components/ui/button";

interface FormActionsProps {
  isSubmitting: boolean;
}

export function FormActions({ isSubmitting }: FormActionsProps) {
  return (
    <Button type="submit" disabled={isSubmitting}>
      {isSubmitting ? "Creating..." : "Create Post"}
    </Button>
  );
}