import { Button } from "@/components/ui/button";
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

interface BlogPostProps {
  post: any;
  onPublish: (id: string) => void;
  onUnpublish: (id: string) => void;
  onEdit: (post: any) => void;
  onDelete: (id: string) => void;
}

export function BlogPost({ post, onPublish, onUnpublish, onEdit, onDelete }: BlogPostProps) {
  return (
    <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h3 className="font-medium">{post.title}</h3>
          {post.summary && (
            <p className="text-sm text-gray-600 line-clamp-2 max-h-12 overflow-hidden">
              {post.summary}
            </p>
          )}
          <p className="text-sm text-gray-500">
            Created: {new Date(post.created_at).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-500">
            Status: {post.status}
          </p>
        </div>
        <div className="flex gap-2">
          {post.status === 'draft' ? (
            <Button
              onClick={() => onPublish(post.id)}
              variant="outline"
              size="sm"
            >
              Publish
            </Button>
          ) : (
            <Button
              onClick={() => onUnpublish(post.id)}
              variant="outline"
              size="sm"
            >
              Unpublish
            </Button>
          )}
          <Button 
            onClick={() => onEdit(post)}
            variant="outline" 
            size="sm"
          >
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the blog post.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(post.id)}>
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