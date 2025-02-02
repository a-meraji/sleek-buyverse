import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BlogPostForm } from "./BlogPostForm";
import { BlogPostList } from "./BlogPostList";

export function AdminBlog() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Blog Management</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "View Posts" : "Create New Post"}
        </Button>
      </div>

      {showForm ? (
        <BlogPostForm onSuccess={() => setShowForm(false)} />
      ) : (
        <BlogPostList />
      )}
    </div>
  );
}