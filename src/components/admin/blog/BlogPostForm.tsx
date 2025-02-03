import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageSelector } from "@/components/admin/ImageSelector";
import { RichTextEditor } from "@/components/admin/product/RichTextEditor";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
  const [categories, setCategories] = useState<string[]>([]);
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
        // Insert image URL into content at cursor position
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
      setCategories([]);
    } catch (error) {
      console.error('Error creating blog post:', error);
      toast.error("Failed to create blog post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={60}
          required
        />
        <p className="text-sm text-gray-500 mt-1">
          {60 - title.length} characters remaining
        </p>
      </div>

      <div>
        <Label htmlFor="metaDescription">Meta Description</Label>
        <Textarea
          id="metaDescription"
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
          maxLength={160}
          required
        />
        <p className="text-sm text-gray-500 mt-1">
          {160 - metaDescription.length} characters remaining
        </p>
      </div>

      <div>
        <Label>Main Image</Label>
        <div className="mt-2 space-y-2">
          {mainImageUrl && (
            <img
              src={mainImageUrl}
              alt="Blog post main image"
              className="w-full h-48 object-cover rounded-lg"
            />
          )}
          <Button 
            type="button" 
            onClick={() => {
              setIsSelectingMainImage(true);
              setShowImageSelector(true);
            }}
          >
            {mainImageUrl ? "Change Image" : "Select Image"}
          </Button>
        </div>
      </div>

      <div>
        <Label>Content</Label>
        <div className="mt-2 space-y-2">
          <Button 
            type="button"
            variant="outline"
            onClick={() => {
              setIsSelectingMainImage(false);
              setShowImageSelector(true);
            }}
          >
            Insert Image
          </Button>
          <RichTextEditor
            value={content}
            onChange={setContent}
          />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Post"}
      </Button>

      <ImageSelector
        open={showImageSelector}
        onClose={() => setShowImageSelector(false)}
        onSelect={handleImageSelect}
      />
    </form>
  );
}