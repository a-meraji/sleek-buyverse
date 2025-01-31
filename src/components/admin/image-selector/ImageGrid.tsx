import { useToast } from "@/hooks/use-toast";
import { ImageCard } from "./image-grid/ImageCard";
import { deleteImage } from "./image-grid/DeleteImageHandler";

interface ImageGridProps {
  images: { name: string; url: string }[];
  onSelect: (url: string) => void;
  onClose: () => void;
  currentFolder: string | null;
  onImagesUpdate: () => void;
}

export function ImageGrid({ 
  images, 
  onSelect, 
  onClose, 
  currentFolder, 
  onImagesUpdate 
}: ImageGridProps) {
  const { toast } = useToast();

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
    <div className="grid grid-cols-3 gap-4">
      {images.map((image) => (
        <ImageCard
          key={image.name}
          image={image}
          onSelect={onSelect}
          onClose={onClose}
          onDelete={handleDeleteImage}
        />
      ))}
    </div>
  );
}