import { Image } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImagePreviewProps {
  imageUrl?: string | null;
  productName?: string;
  onChooseImage: () => void;
}

export function ImagePreview({ imageUrl, productName, onChooseImage }: ImagePreviewProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Product Image</label>
      <div className="flex items-center gap-4">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={productName}
            className="h-20 w-20 object-cover rounded-lg"
          />
        )}
        <Button
          type="button"
          variant="outline"
          onClick={onChooseImage}
        >
          <Image className="h-4 w-4 mr-2" />
          Choose Image
        </Button>
      </div>
    </div>
  );
}