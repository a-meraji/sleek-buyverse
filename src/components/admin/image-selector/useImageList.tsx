import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useImageList(isOpen: boolean) {
  const [images, setImages] = useState<{ name: string; url: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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

      const imageUrls = files
        .filter(file => file.name !== '.emptyFolderPlaceholder')
        .map((file) => {
          const { data } = supabase.storage
            .from('images')
            .getPublicUrl(file.name);
          
          console.log('Public URL for', file.name, ':', data.publicUrl);
          
          return {
            name: file.name,
            url: data.publicUrl
          };
        });

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

  useEffect(() => {
    if (isOpen) {
      loadImages();
    }
  }, [isOpen]);

  return { images, loading, loadImages };
}