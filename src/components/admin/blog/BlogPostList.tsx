import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function BlogPostList() {
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
            </div>
            <div className="flex gap-2">
              {post.status === 'draft' && (
                <Button
                  onClick={() => handlePublish(post.id)}
                  variant="outline"
                  size="sm"
                >
                  Publish
                </Button>
              )}
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}