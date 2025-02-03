import { useState } from "react";

export function useImageSelector() {
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [isSelectingMainImage, setIsSelectingMainImage] = useState(true);
  const [cursorPosition, setCursorPosition] = useState<number>(0);

  return {
    showImageSelector,
    setShowImageSelector,
    isSelectingMainImage,
    setIsSelectingMainImage,
    cursorPosition,
    setCursorPosition
  };
}