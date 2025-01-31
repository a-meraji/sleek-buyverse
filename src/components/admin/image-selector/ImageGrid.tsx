import { useToast } from "@/hooks/use-toast";
import { ImageCard } from "./image-grid/ImageCard";
import { deleteImage } from "./image-grid/DeleteImageHandler";
import { useState } from "react";

interface ImageGridProps {
  images: { name: string; url: string }[];
  onSelect: (url: string | string[]) => void;
  onClose: () => void;
  currentFolder: string | null;
  onImagesUpdate: () => void;
  multiple?: boolean;
}

export function ImageGrid({ 
  images, 
  onSelect, 
  onClose, 
  currentFolder, 
  onImagesUpdate,
  multiple = false
}: ImageGridProps) {
  const { toast } = useToast();
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const handleImageSelect = (url: string) => {
    if (multiple) {
      const newSelectedImages = selectedImages.includes(url)
        ? selectedImages.filter(img => img !== url)
        : [...selectedImages, url];
      setSelectedImages(newSelectedImages);
    } else {
      onSelect(url);
      onClose();
    }
  };

  const handleDone = () => {
    if (selectedImages.length > 0) {
      onSelect(selectedImages);
      onClose();
    }
  };

  const handleDeleteImage = async (imageName: string) => {
    try {
      const filePath = currentFolder ? `${currentFolder}/${imageName}` : imageName;
      console.log('Deleting image:', filePath);
      
      await deleteImage(filePath);

      toast({
        title: "Success",
        description: "Image deleted successfully",
      });

      await onImagesUpdate();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {images.map((image) => (
          <ImageCard
            key={image.name}
            image={image}
            onSelect={() => handleImageSelect(image.url)}
            onClose={onClose}
            onDelete={handleDeleteImage}
            isSelected={multiple ? selectedImages.includes(image.url) : false}
          />
        ))}
      </div>
      {multiple && selectedImages.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={handleDone}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Done ({selectedImages.length} selected)
          </button>
        </div>
      )}
    </div>
  );
}