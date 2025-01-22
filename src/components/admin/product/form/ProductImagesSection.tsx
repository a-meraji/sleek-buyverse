import { ProductImage } from "@/types";
import { ImagePreview } from "../ImagePreview";

interface ProductImagesSectionProps {
  mainImage: string;
  productName?: string;
  additionalImages?: ProductImage[];
  onChooseMainImage: () => void;
  onAddAdditionalImage: () => void;
  onRemoveImage?: (imageUrl: string) => void;
}

export function ProductImagesSection({
  mainImage,
  productName,
  additionalImages,
  onChooseMainImage,
  onAddAdditionalImage,
  onRemoveImage,
}: ProductImagesSectionProps) {
  return (
    <ImagePreview
      imageUrl={mainImage}
      productName={productName ?? ""}
      additionalImages={additionalImages}
      onChooseImage={onChooseMainImage}
      onAddAdditionalImage={onAddAdditionalImage}
      onRemoveImage={onRemoveImage}
    />
  );
}