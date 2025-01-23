import { Button } from "@/components/ui/button";

interface CampaignFormActionsProps {
  onClose: () => void;
  isPending: boolean;
  isEditing: boolean;
}

export function CampaignFormActions({ onClose, isPending, isEditing }: CampaignFormActionsProps) {
  return (
    <div className="flex justify-end gap-2">
      <Button type="button" variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button type="submit" disabled={isPending}>
        {isEditing ? "Update" : "Create"} Campaign
      </Button>
    </div>
  );
}