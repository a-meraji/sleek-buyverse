import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useBlogList() {
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

  return {
    posts,
    isLoading,
    handlePublish,
    handleUnpublish,
    handleDelete
  };
}