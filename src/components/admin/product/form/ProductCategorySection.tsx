import { CategorySelector } from "../CategorySelector";

interface ProductCategorySectionProps {
  mainCategory: string;
  secondaryCategories: string[];
  onMainCategoryChange: (value: string) => void;
  onSecondaryCategoriesChange: (categories: string[]) => void;
}

export function ProductCategorySection({
  mainCategory,
  secondaryCategories,
  onMainCategoryChange,
  onSecondaryCategoriesChange
}: ProductCategorySectionProps) {
  return (
    <CategorySelector
      mainCategory={mainCategory}
      secondaryCategories={secondaryCategories}
      onMainCategoryChange={onMainCategoryChange}
      onSecondaryCategoriesChange={onSecondaryCategoriesChange}
    />
  );
}