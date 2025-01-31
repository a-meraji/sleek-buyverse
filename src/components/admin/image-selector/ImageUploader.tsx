import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface ImageUploaderProps {
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  isUploading: boolean;
}

export function ImageUploader({ onUpload, isUploading }: ImageUploaderProps) {
  return (
    <div className="flex items-center gap-4">
      <Input
        type="file"
        accept="image/*"
        multiple
        onChange={onUpload}
        disabled={isUploading}
        className="cursor-pointer"
      />
      {isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
    </div>
  );
}