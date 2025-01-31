import { Image, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ProductImage } from "@/types";

interface ImagePreviewProps {
  imageUrl?: string | null;
  productName?: string;
  additionalImages?: ProductImage[];
  onChooseImage: () => void;
  onAddAdditionalImage: () => void;
  onRemoveImage?: (imageUrl: string) => void;
  onMultipleSelectChange?: (enabled: boolean) => void;
  multipleSelect?: boolean;
}

export function ImagePreview({ 
  imageUrl, 
  productName, 
  additionalImages = [],
  onChooseImage,
  onAddAdditionalImage,
  onRemoveImage,
  onMultipleSelectChange,
  multipleSelect = false
}: ImagePreviewProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Main Product Image</label>
        <div className="flex items-center gap-4">
          {imageUrl ? (
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
          ) : (
            <div className="h-20 w-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <Image className="h-8 w-8 text-gray-400" />
            </div>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={onChooseImage}
          >
            {imageUrl ? 'Change Main Image' : 'Add Main Image'}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium">Additional Images</label>
            {onMultipleSelectChange && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="multiple-select"
                  checked={multipleSelect}
                  onCheckedChange={onMultipleSelectChange}
                />
                <Label htmlFor="multiple-select" className="text-sm text-muted-foreground">
                  Multiple Selection
                </Label>
              </div>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={onAddAdditionalImage}
          >
            Add Image
          </Button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {additionalImages?.map((image) => (
            <div key={image.id} className="relative group">
              <img
                src={image.image_url}
                alt="Additional product image"
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
        </div>
      </div>
    </div>
  );
}