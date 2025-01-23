import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ImageSelector } from "../../ImageSelector";

interface ImageSectionProps {
  imageUrl: string | null;
  showImageSelector: boolean;
  onImageSelect: (url: string) => void;
  onShowImageSelector: (show: boolean) => void;
}

export function ImageSection({
  imageUrl,
  showImageSelector,
  onImageSelect,
  onShowImageSelector,
}: ImageSectionProps) {
  return (
    <div>
      <Label>Campaign Image</Label>
      <div className="mt-2 space-y-2">
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Campaign"
            className="w-full h-48 object-cover rounded-lg"
          />
        )}
        <Button type="button" onClick={() => onShowImageSelector(true)}>
          {imageUrl ? "Change Image" : "Select Image"}
        </Button>
      </div>

      <ImageSelector
        open={showImageSelector}
        onClose={() => onShowImageSelector(false)}
        onSelect={onImageSelect}
      />
    </div>
  );
}