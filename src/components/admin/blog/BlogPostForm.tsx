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
  const [title, setTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [content, setContent] = useState("");
  const [mainImageUrl, setMainImageUrl] = useState("");
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSelectingMainImage, setIsSelectingMainImage] = useState(true);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleImageSelect = (url: string | string[]) => {
    if (typeof url === 'string') {
      if (isSelectingMainImage) {
        setMainImageUrl(url);
      } else {
        const imageHtml = `\n![Blog content image](${url})\n`;
        setContent(prev => prev + imageHtml);
      }
    }
    setShowImageSelector(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const slug = generateSlug(title);
      
      const { error } = await supabase
        .from('blog_posts')
        .insert({
          title,
          slug,
          meta_description: metaDescription,
          content,
          main_image_url: mainImageUrl,
          status: 'draft'
        });

      if (error) throw error;

      toast.success("Blog post created successfully!");
      onSuccess?.();
      
      // Reset form
      setTitle("");
      setMetaDescription("");
      setContent("");
      setMainImageUrl("");
    } catch (error) {
      console.error('Error creating blog post:', error);
      toast.error("Failed to create blog post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <TitleMetaSection
        title={title}
        metaDescription={metaDescription}
        onTitleChange={setTitle}
        onMetaDescriptionChange={setMetaDescription}
      />

      <MainImageSection
        mainImageUrl={mainImageUrl}
        onImageSelect={() => {
          setIsSelectingMainImage(true);
          setShowImageSelector(true);
        }}
      />

      <ContentEditorSection
        content={content}
        onContentChange={setContent}
        onInsertImage={() => {
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