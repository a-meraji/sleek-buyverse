import { ProductForm } from "./ProductForm";
import { ProductFormContainerProps } from "@/types";

export function ProductFormContainer({ onClose }: ProductFormContainerProps) {
  return <ProductForm onClose={onClose} />;
}