import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ImageSelector } from "@/components/admin/ImageSelector";
import { TitleMetaSection } from "./form/TitleMetaSection";
import { MainImageSection } from "./form/MainImageSection";
import { ContentEditorSection } from "./form/ContentEditorSection";
import { FormActions } from "./form/FormActions";

interface BlogPostFormProps {
  onSuccess?: () => void;
}

export function BlogPostForm({ onSuccess }: BlogPostFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    metaDescription: "",
    content: "",
    mainImageUrl: "",
  });
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSelectingMainImage, setIsSelectingMainImage] = useState(true);
  const [cursorPosition, setCursorPosition] = useState<number>(0);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleImageSelect = (url: string | string[]) => {
    if (typeof url === 'string') {
      if (isSelectingMainImage) {
        setFormData(prev => ({ ...prev, mainImageUrl: url }));
      } else {
        const imgTag = `<img src="${url}" alt="Blog content image" class="w-full rounded-lg" />`;
        const newContent = formData.content.slice(0, cursorPosition) + imgTag + formData.content.slice(cursorPosition);
        setFormData(prev => ({ ...prev, content: newContent }));
      }
    }
    setShowImageSelector(false);
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <TitleMetaSection
        title={formData.title}
        metaDescription={formData.metaDescription}
        onTitleChange={(title) => setFormData(prev => ({ ...prev, title }))}
        onMetaDescriptionChange={(metaDescription) => 
          setFormData(prev => ({ ...prev, metaDescription }))
        }
      />

      <MainImageSection
        mainImageUrl={formData.mainImageUrl}
        onImageSelect={() => {
          setIsSelectingMainImage(true);
          setShowImageSelector(true);
        }}
      />

      <ContentEditorSection
        content={formData.content}
        onContentChange={(content) => setFormData(prev => ({ ...prev, content }))}
        onInsertImage={(position) => {
          setCursorPosition(position);
          setIsSelectingMainImage(false);
          setShowImageSelector(true);
        }}
      />

      <FormActions isSubmitting={isSubmitting} />

      <ImageSelector
        open={showImageSelector}
        onClose={() => setShowImageSelector(false)}
        onSelect={handleImageSelect}
      />
    </form>
  );
}