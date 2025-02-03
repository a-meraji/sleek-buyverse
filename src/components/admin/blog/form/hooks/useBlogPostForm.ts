import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface BlogFormData {
  title: string;
  metaDescription: string;
  content: string;
  mainImageUrl: string;
}

export function useBlogPostForm(onSuccess?: () => void) {
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    metaDescription: "",
    content: "",
    mainImageUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.title || !formData.content || !formData.mainImageUrl) {
        throw new Error("Please fill in all required fields");
      }

      const slug = generateSlug(formData.title);
      console.log("Creating blog post with data:", {
        title: formData.title,
        slug,
        meta_description: formData.metaDescription,
        content: formData.content,
        main_image_url: formData.mainImageUrl,
      });
      
      const { error } = await supabase
        .from('blog_posts')
        .insert({
          title: formData.title,
          slug,
          meta_description: formData.metaDescription,
          content: formData.content,
          main_image_url: formData.mainImageUrl,
          status: 'draft'
        });

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      toast.success("Blog post created successfully!");
      onSuccess?.();
      
      setFormData({
        title: "",
        metaDescription: "",
        content: "",
        mainImageUrl: "",
      });
    } catch (error) {
      console.error('Error creating blog post:', error);
      toast.error(error instanceof Error ? error.message : "Failed to create blog post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    isSubmitting,
    handleSubmit
  };
}