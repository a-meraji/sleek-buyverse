import { ImageSelector } from "../../ImageSelector";

interface ImageSelectorWrapperProps {
  showImageSelector: boolean;
  onClose: () => void;
  onSelect: (url: string | string[]) => void;
  multiple?: boolean;
}

export function ImageSelectorWrapper({
  showImageSelector,
  onClose,
  onSelect,
  multiple = false,
}: ImageSelectorWrapperProps) {
  return (
    <ImageSelector
      open={showImageSelector}
      onClose={onClose}
      onSelect={onSelect}
      multiple={multiple}
    />
  );
}