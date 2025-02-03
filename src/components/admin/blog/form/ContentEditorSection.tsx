import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

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
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Content (HTML)</Label>
        <div className="space-x-2">
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
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? "Edit HTML" : "Preview"}
          </Button>
        </div>
      </div>

      {showPreview ? (
        <div 
          className="prose max-w-none p-4 border rounded-lg bg-white"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <Textarea
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          className="min-h-[400px] font-mono"
          placeholder="Enter HTML content here..."
        />
      )}
    </div>
  );
}