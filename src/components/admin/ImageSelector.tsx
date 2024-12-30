import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface ImageSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

export function ImageSelector({ open, onClose, onSelect }: ImageSelectorProps) {
  const [images, setImages] = useState<{ name: string; url: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadImages();
    }
  }, [open]);

  const loadImages = async () => {
    try {
      console.log('Loading images from storage...');
      const { data: files, error } = await supabase.storage
        .from('images')
        .list('', {
          sortBy: { column: 'name', order: 'asc' }
        });

      if (error) {
        console.error('Error listing files:', error);
        throw error;
      }

      console.log('Files retrieved:', files);

      // Filter out the placeholder file and get public URLs
      const imageUrls = await Promise.all(
        files
          .filter(file => file.name !== '.emptyFolderPlaceholder')
          .map(async (file) => {
            const { data } = supabase.storage
              .from('images')
              .getPublicUrl(file.name);

            console.log('Public URL for', file.name, ':', data.publicUrl);
            
            return {
              name: file.name,
              url: data.publicUrl
            };
          })
      );

      console.log('Processed image URLs:', imageUrls);
      setImages(imageUrls);
    } catch (error) {
      console.error('Error loading images:', error);
      toast({
        title: "Error",
        description: "Failed to load images",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setUploading(true);
      console.log('Uploading file:', file.name);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('File uploaded successfully:', fileName);
      await loadImages();
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Image</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
            />
            {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
          </div>

          {loading ? (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {images.map((image) => (
                <div
                  key={image.name}
                  className="relative group cursor-pointer aspect-square"
                  onClick={() => {
                    console.log('Selected image:', image.url);
                    onSelect(image.url);
                    onClose();
                  }}
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                    <Button variant="secondary" size="sm">
                      Select
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}