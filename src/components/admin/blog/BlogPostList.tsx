import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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
import { useState } from "react";
import { BlogPostForm } from "./BlogPostForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export function BlogPostList() {
  const [editingPost, setEditingPost] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const { data: posts, isLoading, refetch } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const handlePublish = async (id: string) => {
    try {
      console.log("Publishing post:", id);
      const { error } = await supabase
        .from('blog_posts')
        .update({ 
          status: 'published',
          published_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Post published successfully!");
      refetch();
    } catch (error) {
      console.error('Error publishing post:', error);
      toast.error("Failed to publish post");
    }
  };

  const handleUnpublish = async (id: string) => {
    try {
      console.log("Unpublishing post:", id);
      const { error } = await supabase
        .from('blog_posts')
        .update({ 
          status: 'draft',
          published_at: null
        })
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Post unpublished successfully!");
      refetch();
    } catch (error) {
      console.error('Error unpublishing post:', error);
      toast.error("Failed to unpublish post");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      console.log("Deleting post:", id);
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Post deleted successfully!");
      refetch();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error("Failed to delete post");
    }
  };

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setShowEditDialog(true);
  };

  const handleEditSuccess = () => {
    setShowEditDialog(false);
    setEditingPost(null);
    refetch();
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      {posts?.map((post) => (
        <div
          key={post.id}
          className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{post.title}</h3>
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
                  onClick={() => handlePublish(post.id)}
                  variant="outline"
                  size="sm"
                >
                  Publish
                </Button>
              ) : (
                <Button
                  onClick={() => handleUnpublish(post.id)}
                  variant="outline"
                  size="sm"
                >
                  Unpublish
                </Button>
              )}
              <Button 
                onClick={() => handleEdit(post)}
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
                    <AlertDialogAction onClick={() => handleDelete(post.id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      ))}

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="space-y-6 pb-6">
            <BlogPostForm 
              initialData={editingPost}
              onSuccess={handleEditSuccess}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}