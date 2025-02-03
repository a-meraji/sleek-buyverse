import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/admin/product/RichTextEditor";

interface ContentEditorSectionProps {
  content: string;
  onContentChange: (value: string) => void;
  onInsertImage: () => void;
}

export function ContentEditorSection({
  content,
  onContentChange,
  onInsertImage
}: ContentEditorSectionProps) {
  return (
    <div>
      <Label>Content</Label>
      <div className="mt-2 space-y-2">
        <Button 
          type="button"
          variant="outline"
          onClick={onInsertImage}
        >
          Insert Image
        </Button>
        <RichTextEditor
          value={content}
          onChange={onContentChange}
        />
      </div>
    </div>
  );
}