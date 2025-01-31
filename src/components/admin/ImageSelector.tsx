import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { ImageGrid } from "./image-selector/ImageGrid";
import { ImageUploader } from "./image-selector/ImageUploader";
import { FolderList } from "./image-selector/folder-manager/FolderList";
import { NewFolderDialog } from "./image-selector/folder-manager/NewFolderDialog";
import { FolderSearch } from "./image-selector/folder-manager/FolderSearch";

interface ImageSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

export function ImageSelector({ open, onClose, onSelect }: ImageSelectorProps) {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<{ name: string; url: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [searchFolder, setSearchFolder] = useState<string>("");
  const { toast } = useToast();

  const loadFolders = async () => {
    try {
      const { data, error } = await supabase
        .from('image_folders')
        .select('*')
        .order('name');

      if (error) throw error;
      setFolders(data);
    } catch (error) {
      console.error('Error loading folders:', error);
      toast({
        title: "Error",
        description: "Failed to load folders",
        variant: "destructive",
      });
    }
  };

  const loadImages = async () => {
    try {
      setLoading(true);
      console.log('Loading images from storage...');

      const { data: files, error } = await supabase.storage
        .from('images')
        .list(currentFolder ? `${currentFolder}/` : '', {
          sortBy: { column: 'name', order: 'desc' }
        });

      if (error) throw error;

      console.log('Files retrieved:', files);

      const imageUrls = files
        .filter(file => file.name !== '.emptyFolderPlaceholder')
        .map((file) => {
          const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(currentFolder ? `${currentFolder}/${file.name}` : file.name);
          
          return {
            name: file.name,
            url: publicUrl
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
    if (open) {
      loadFolders();
      loadImages();
    }
  }, [open, currentFolder]);

  useEffect(() => {
    if (searchFolder.length > 0) {
      const filteredFolders = folders.filter((folder: any) => 
        folder.name.toLowerCase().includes(searchFolder.toLowerCase())
      );
      setFolders(filteredFolders);
    } else {
      loadFolders();
    }
  }, [searchFolder]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = Array.from(event.target.files || []);
      if (files.length === 0) return;

      setUploading(true);
      console.log('Uploading files:', files.map(f => f.name));

      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = currentFolder ? `${currentFolder}/${fileName}` : fileName;

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;
        console.log('File uploaded successfully:', fileName);
      });

      await Promise.all(uploadPromises);
      await loadImages();
      
      toast({
        title: "Success",
        description: `${files.length} image${files.length > 1 ? 's' : ''} uploaded successfully`,
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: "Error",
        description: "Failed to upload images",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Image</DialogTitle>
        </DialogHeader>

        <div dir="ltr" className="grid grid-cols-4 gap-4">
          <div className="col-span-1 space-y-4 border-r pr-4">
            <NewFolderDialog 
              currentFolder={currentFolder} 
              onFoldersUpdate={loadFolders} 
            />
            <FolderSearch 
              onSearchChange={setSearchFolder} 
              searchQuery={searchFolder}
            />
            <FolderList
              folders={folders}
              currentFolder={currentFolder}
              onFolderSelect={setCurrentFolder}
              onFoldersUpdate={loadFolders}
            />
          </div>

          <div className="col-span-3 space-y-4">
            <ImageUploader 
              onUpload={handleFileUpload}
              isUploading={uploading}
            />

            {loading ? (
              <div className="flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <ImageGrid 
                images={images}
                onSelect={onSelect}
                onClose={onClose}
                currentFolder={currentFolder}
                onImagesUpdate={loadImages}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}