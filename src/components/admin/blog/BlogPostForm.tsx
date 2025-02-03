import { ImageSelector } from "@/components/admin/ImageSelector";
import { TitleMetaSection } from "./form/TitleMetaSection";
import { MainImageSection } from "./form/MainImageSection";
import { ContentEditorSection } from "./form/ContentEditorSection";
import { FormActions } from "./form/FormActions";
import { useBlogPostForm } from "./form/hooks/useBlogPostForm";
import { useImageSelector } from "./form/hooks/useImageSelector";

interface BlogPostFormProps {
  onSuccess?: () => void;
}

export function BlogPostForm({ onSuccess }: BlogPostFormProps) {
  const {
    formData,
    setFormData,
    isSubmitting,
    handleSubmit
  } = useBlogPostForm(onSuccess);

  const {
    showImageSelector,
    setShowImageSelector,
    isSelectingMainImage,
    setIsSelectingMainImage,
    cursorPosition,
    setCursorPosition
  } = useImageSelector();

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