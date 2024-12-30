import { Button } from "@/components/ui/button";

interface ImageGridProps {
  images: { name: string; url: string }[];
  onSelect: (url: string) => void;
  onClose: () => void;
}

export function ImageGrid({ images, onSelect, onClose }: ImageGridProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((image) => (
        <div
          key={image.name}
          className="relative group cursor-pointer aspect-square bg-muted rounded-lg overflow-hidden"
          onClick={() => {
            console.log('Selected image:', image.url);
            onSelect(image.url);
            onClose();
          }}
        >
          <img
            src={image.url}
            alt={image.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error('Error loading image:', image.url);
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button variant="secondary" size="sm">
              Select
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}