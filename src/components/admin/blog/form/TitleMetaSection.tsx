import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TitleMetaSectionProps {
  title: string;
  metaDescription: string;
  onTitleChange: (value: string) => void;
  onMetaDescriptionChange: (value: string) => void;
}

export function TitleMetaSection({
  title,
  metaDescription,
  onTitleChange,
  onMetaDescriptionChange
}: TitleMetaSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          maxLength={60}
          required
        />
        <p className="text-sm text-gray-500 mt-1">
          {60 - title.length} characters remaining
        </p>
      </div>

      <div>
        <Label htmlFor="metaDescription">Meta Description</Label>
        <Textarea
          id="metaDescription"
          value={metaDescription}
          onChange={(e) => onMetaDescriptionChange(e.target.value)}
          maxLength={160}
          required
        />
        <p className="text-sm text-gray-500 mt-1">
          {160 - metaDescription.length} characters remaining
        </p>
      </div>
    </div>
  );
}