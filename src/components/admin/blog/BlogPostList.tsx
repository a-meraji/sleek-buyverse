import { useState } from "react";
import { BlogPost } from "./list/BlogPost";
import { EditBlogDialog } from "./list/EditBlogDialog";
import { useBlogList } from "./list/useBlogList";

export function BlogPostList() {
  const [editingPost, setEditingPost] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  
  const {
    posts,
    isLoading,
    handlePublish,
    handleUnpublish,
    handleDelete
  } = useBlogList();

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setShowEditDialog(true);
  };

  const handleEditSuccess = () => {
    setShowEditDialog(false);
    setEditingPost(null);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      {posts?.map((post) => (
        <BlogPost
          key={post.id}
          post={post}
          onPublish={handlePublish}
          onUnpublish={handleUnpublish}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}

      <EditBlogDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        editingPost={editingPost}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}