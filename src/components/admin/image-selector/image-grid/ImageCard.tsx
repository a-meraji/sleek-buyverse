import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ImageCardProps {
  image: { name: string; url: string };
  onSelect: (url: string) => void;
  onClose: () => void;
  onDelete: (imageName: string) => Promise<void>;
}

export function ImageCard({ image, onSelect, onClose, onDelete }: ImageCardProps) {
  return (
    <div className="relative group">
      <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
        <img
          src={image.url}
          alt={image.name}
          className="w-full h-full object-cover cursor-pointer"
          onClick={() => {
            console.log('Selected image:', image.url);
            onSelect(image.url);
            onClose();
          }}
          onError={(e) => {
            console.error('Error loading image:', image.url);
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => {
              onSelect(image.url);
              onClose();
            }}
          >
            Select
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Image</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this image? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(image.name)}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}