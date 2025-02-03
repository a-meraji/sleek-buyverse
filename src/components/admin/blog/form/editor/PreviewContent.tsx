import { Label } from "@/components/ui/label";

interface PreviewContentProps {
  content: string;
}

export function PreviewContent({ content }: PreviewContentProps) {
  return (
    <div className="space-y-2">
      <Label>Preview</Label>
      <div 
        className="prose max-w-none p-4 border rounded-lg bg-white"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}