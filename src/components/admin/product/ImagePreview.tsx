import { Image, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/types";

interface ImagePreviewProps {
  imageUrl?: string | null;
  productName?: string;
  additionalImages?: ProductImage[];
  onChooseImage: () => void;
  onRemoveImage?: (imageUrl: string) => void;
}

export function ImagePreview({ 
  imageUrl, 
  productName, 
  additionalImages = [],
  onChooseImage,
  onRemoveImage 
}: ImagePreviewProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Product Images</label>
      <div className="flex flex-wrap gap-4">
        {imageUrl && (
          <div className="relative group">
            <img
              src={imageUrl}
              alt={`Main image - ${productName}`}
              className="h-20 w-20 object-cover rounded-lg border border-border"
            />
            {onRemoveImage && (
              <button
                onClick={() => onRemoveImage(imageUrl)}
                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
        
        {additionalImages?.map((image, index) => (
          <div key={image.id || index} className="relative group">
            <img
              src={image.image_url}
              alt={`Product image ${index + 1}`}
              className="h-20 w-20 object-cover rounded-lg border border-border"
            />
            {onRemoveImage && (
              <button
                onClick={() => onRemoveImage(image.image_url)}
                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          onClick={onChooseImage}
          className="h-20 w-20 flex flex-col items-center justify-center gap-1"
        >
          <Image className="h-4 w-4" />
          <span className="text-xs">Add Image</span>
        </Button>
      </div>
    </div>
  );
}