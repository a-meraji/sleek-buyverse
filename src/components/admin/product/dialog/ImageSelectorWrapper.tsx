import { ImageSelector } from "../../ImageSelector";

interface ImageSelectorWrapperProps {
  showImageSelector: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

export function ImageSelectorWrapper({
  showImageSelector,
  onClose,
  onSelect,
}: ImageSelectorWrapperProps) {
  return (
    <ImageSelector
      open={showImageSelector}
      onClose={onClose}
      onSelect={onSelect}
    />
  );
}