import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export interface CategorySelectorProps {
  mainCategory: string;
  secondaryCategories: string[];
  onMainCategoryChange: (value: string) => void;
  onSecondaryCategoriesChange: (categories: string[]) => void;
}

interface CategoryDropdownProps {
  value: string;
  categories: string[];
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export function CategoryDropdown({
  value,
  categories,
  onValueChange,
  placeholder = "Select a category"
}: CategoryDropdownProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full bg-white">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-white">
        {categories?.map((category) => (
          <SelectItem key={category} value={category}>
            {category}
          </SelectItem>
        ))}
        <SelectItem value="new">
          <span className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add new category
          </span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

export function CategorySelector({
  mainCategory,
  secondaryCategories,
  onMainCategoryChange,
  onSecondaryCategoriesChange
}: CategorySelectorProps) {
  const handleRemoveSecondaryCategory = (categoryToRemove: string) => {
    onSecondaryCategoriesChange(
      secondaryCategories.filter(cat => cat !== categoryToRemove)
    );
  };

  const handleAddSecondaryCategory = (category: string) => {
    if (!secondaryCategories.includes(category) && category !== mainCategory) {
      onSecondaryCategoriesChange([...secondaryCategories, category]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Main Category</label>
        <CategoryDropdown
          value={mainCategory}
          categories={[]}
          onValueChange={onMainCategoryChange}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Secondary Categories</label>
        <div className="flex flex-wrap gap-2">
          {secondaryCategories.map((category) => (
            <Badge key={category} variant="secondary" className="px-2 py-1">
              {category}
              <button
                onClick={() => handleRemoveSecondaryCategory(category)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <CategoryDropdown
            value=""
            categories={[]}
            onValueChange={handleAddSecondaryCategory}
            placeholder="Add secondary category..."
          />
        </div>
      </div>
    </div>
  );
}