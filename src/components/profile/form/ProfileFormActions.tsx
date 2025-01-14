import { Button } from "@/components/ui/button";

interface ProfileFormActionsProps {
  hasChanges: boolean;
  onCancel: () => void;
}

export function ProfileFormActions({ hasChanges, onCancel }: ProfileFormActionsProps) {
  if (!hasChanges) return null;
  
  return (
    <div className="flex justify-end gap-2">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit">
        Save Changes
      </Button>
    </div>
  );
}