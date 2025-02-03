import { Dialog, DialogContent } from "@/components/ui/dialog";
import { BlogPostForm } from "../BlogPostForm";

interface EditBlogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingPost: any;
  onSuccess: () => void;
}

export function EditBlogDialog({ open, onOpenChange, editingPost, onSuccess }: EditBlogDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-6 pb-6">
          <BlogPostForm 
            initialData={editingPost}
            onSuccess={onSuccess}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}