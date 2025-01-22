import { CategorySelector } from "../CategorySelector";

interface ProductCategorySectionProps {
  category: string;
  onChange: (value: string) => void;
}

export function ProductCategorySection({ category, onChange }: ProductCategorySectionProps) {
  return (
    <CategorySelector
      value={category}
      onChange={onChange}
    />
  );
}