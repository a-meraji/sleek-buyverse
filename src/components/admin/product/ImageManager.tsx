import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/types";
import { Trash2, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ImageManagerProps {
  productId?: string;
  mainImage: string;
  additionalImages?: ProductImage[];
  onMainImageSelect: () => void;
  onImagesChange: (images: ProductImage[]) => void;
}

export function ImageManager({
  productId,
  mainImage,
  additionalImages = [],
  onMainImageSelect,
  onImagesChange,
}: ImageManagerProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDeleteImage = async (imageId: string) => {
    if (!productId) return;
    
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('product_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      onImagesChange(additionalImages.filter(img => img.id !== imageId));
      
      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Main Product Image</label>
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 overflow-hidden rounded-md border">
            <img
              src={mainImage}
              alt="Main product image"
              className="h-full w-full object-cover"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={onMainImageSelect}
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Change Main Image
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Additional Images</label>
          <Button
            type="button"
            variant="outline"
            onClick={onMainImageSelect}
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Add Image
          </Button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {additionalImages.map((image) => (
            <div key={image.id} className="relative group">
              <div className="aspect-square overflow-hidden rounded-md border">
                <img
                  src={image.image_url}
                  alt="Product"
                  className="h-full w-full object-cover"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleDeleteImage(image.id)}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}