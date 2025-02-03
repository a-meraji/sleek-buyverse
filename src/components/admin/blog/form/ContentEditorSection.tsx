import { Label } from "@/components/ui/label";
import { useState } from "react";
import { PreviewContent } from "./editor/PreviewContent";
import { HtmlEditor } from "./editor/HtmlEditor";
import { EditorToolbar } from "./editor/EditorToolbar";

interface ContentEditorSectionProps {
  content: string;
  onContentChange: (value: string) => void;
  onInsertImage: (cursorPosition: number) => void;
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
        <EditorToolbar 
          onInsertImage={() => {
            if (!showPreview) {
              onInsertImage(0);
            }
          }}
          onTogglePreview={() => setShowPreview(!showPreview)}
          showPreview={showPreview}
        />
      </div>

      {showPreview ? (
        <PreviewContent content={content} />
      ) : (
        <HtmlEditor
          content={content}
          onContentChange={onContentChange}
          onCursorPosition={onInsertImage}
        />
      )}
    </div>
  );
}