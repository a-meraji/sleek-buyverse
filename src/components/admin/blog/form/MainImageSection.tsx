import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface MainImageSectionProps {
  mainImageUrl: string;
  onImageSelect: () => void;
}

export function MainImageSection({ mainImageUrl, onImageSelect }: MainImageSectionProps) {
  return (
    <div>
      <Label>Main Image</Label>
      <div className="mt-2 space-y-2">
        {mainImageUrl && (
          <img
            src={mainImageUrl}
            alt="Blog post main image"
            className="w-full h-48 object-cover rounded-lg"
          />
        )}
        <Button type="button" onClick={onImageSelect}>
          {mainImageUrl ? "Change Image" : "Select Image"}
        </Button>
      </div>
    </div>
  );
}