import { ProductImage } from "@/types";
import { ImageSelector } from "../../ImageSelector";
import { ImagePreview } from "../ImagePreview";

interface ProductImageSectionProps {
  mainImage: string;
  productName?: string;
  additionalImages?: ProductImage[];
  showImageSelector: boolean;
  isSelectingMainImage: boolean;
  onChooseMainImage: () => void;
  onAddAdditionalImage: () => void;
  onImageSelect: (url: string) => void;
  onCloseImageSelector: () => void;
  onRemoveImage?: (imageUrl: string) => void;
}

export function ProductImageSection({
  mainImage,
  productName,
  additionalImages = [],
  showImageSelector,
  isSelectingMainImage,
  onChooseMainImage,
  onAddAdditionalImage,
  onImageSelect,
  onCloseImageSelector,
  onRemoveImage,
}: ProductImageSectionProps) {
  return (
    <>
      <ImagePreview
        imageUrl={mainImage}
        productName={productName}
        additionalImages={additionalImages}
        onChooseImage={onChooseMainImage}
        onAddAdditionalImage={onAddAdditionalImage}
        onRemoveImage={onRemoveImage}
      />

      <ImageSelector
        open={showImageSelector}
        onClose={onCloseImageSelector}
        onSelect={onImageSelect}
      />
    </>
  );
}