import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface BlogFormData {
  title: string;
  metaDescription: string;
  content: string;
  mainImageUrl: string;
  summary: string;
}

interface UseBlogPostFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

export function useBlogPostForm({ initialData, onSuccess }: UseBlogPostFormProps) {
  const [formData, setFormData] = useState<BlogFormData>({
    title: initialData?.title || "",
    metaDescription: initialData?.meta_description || "",
    content: initialData?.content || "",
    mainImageUrl: initialData?.main_image_url || "",
    summary: initialData?.summary || "",
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
      const postData = {
        title: formData.title,
        slug,
        meta_description: formData.metaDescription,
        content: formData.content,
        main_image_url: formData.mainImageUrl,
        summary: formData.summary,
      };

      console.log("Submitting blog post data:", postData);
      
      let error;
      if (initialData) {
        // Update existing post
        const { error: updateError } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', initialData.id);
        error = updateError;
      } else {
        // Create new post
        const { error: insertError } = await supabase
          .from('blog_posts')
          .insert({
            ...postData,
            status: 'draft'
          });
        error = insertError;
      }

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      toast.success(initialData ? "Blog post updated successfully!" : "Blog post created successfully!");
      onSuccess?.();
      
      if (!initialData) {
        setFormData({
          title: "",
          metaDescription: "",
          content: "",
          mainImageUrl: "",
          summary: "",
        });
      }
    } catch (error) {
      console.error('Error saving blog post:', error);
      toast.error(error instanceof Error ? error.message : "Failed to save blog post");
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