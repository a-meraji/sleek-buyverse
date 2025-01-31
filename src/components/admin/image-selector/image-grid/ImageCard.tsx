import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageCardProps {
  image: { name: string; url: string };
  onSelect: () => void;
  onClose: () => void;
  onDelete: (name: string) => void;
  isSelected?: boolean;
}

export function ImageCard({ 
  image, 
  onSelect, 
  onDelete,
  isSelected = false
}: ImageCardProps) {
  return (
    <div 
      className={cn(
        "relative group rounded-lg overflow-hidden border cursor-pointer transition-all",
        isSelected && "ring-2 ring-primary ring-offset-2"
      )}
      onClick={onSelect}
    >
      <img
        src={image.url}
        alt={image.name}
        className="w-full h-48 object-cover"
      />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(image.name);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}