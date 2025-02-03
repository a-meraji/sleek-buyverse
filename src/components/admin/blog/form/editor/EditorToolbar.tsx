import { Button } from "@/components/ui/button";

interface EditorToolbarProps {
  onInsertImage: () => void;
  onTogglePreview: () => void;
  showPreview: boolean;
}

export function EditorToolbar({ onInsertImage, onTogglePreview, showPreview }: EditorToolbarProps) {
  return (
    <div className="flex items-center justify-between">
      <Button 
        type="button"
        variant="outline"
        onClick={onInsertImage}
      >
        Insert Image
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={onTogglePreview}
      >
        {showPreview ? "Edit HTML" : "Preview"}
      </Button>
    </div>
  );
}