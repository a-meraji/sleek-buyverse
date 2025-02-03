import { useRef } from "react";
import { Textarea } from "@/components/ui/textarea";

interface HtmlEditorProps {
  content: string;
  onContentChange: (value: string) => void;
  onCursorPosition: (position: number) => void;
}

export function HtmlEditor({ content, onContentChange, onCursorPosition }: HtmlEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInsertImageClick = () => {
    if (textareaRef.current) {
      onCursorPosition(textareaRef.current.selectionStart);
    }
  };

  return (
    <Textarea
      ref={textareaRef}
      value={content}
      onChange={(e) => onContentChange(e.target.value)}
      className="min-h-[400px] font-mono"
      placeholder="Enter HTML content here..."
      onSelect={handleInsertImageClick}
    />
  );
}