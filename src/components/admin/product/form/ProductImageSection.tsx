import { ProductImage } from "@/types/product";
import { ImagePreview } from "../ImagePreview";

interface ProductImageSectionProps {
  mainImage: string;
  productName?: string;
  additionalImages: ProductImage[];
  onChooseMainImage: () => void;
  onAddAdditionalImage: () => void;
  onRemoveImage?: (imageUrl: string) => void;
}

export function ProductImageSection({
  mainImage,
  productName,
  additionalImages,
  onChooseMainImage,
  onAddAdditionalImage,
  onRemoveImage,
}: ProductImageSectionProps) {
  return (
    <ImagePreview
      imageUrl={mainImage}
      productName={productName}
      additionalImages={additionalImages}
      onChooseImage={onChooseMainImage}
      onAddAdditionalImage={onAddAdditionalImage}
      onRemoveImage={onRemoveImage}
    />
  );
}