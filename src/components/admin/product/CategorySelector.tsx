import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CategoryDropdown } from "./CategoryDropdown";
import { NewCategoryForm } from "./NewCategoryForm";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface CategorySelectorProps {
  mainCategory: string;
  secondaryCategories: string[];
  onMainCategoryChange: (category: string) => void;
  onSecondaryCategoriesChange: (categories: string[]) => void;
}

export function CategorySelector({ 
  mainCategory, 
  secondaryCategories, 
  onMainCategoryChange, 
  onSecondaryCategoriesChange 
}: CategorySelectorProps) {
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [showSecondaryInput, setShowSecondaryInput] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ["product-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("main_category, secondary_categories")
        .not("main_category", "is", null);

      if (error) throw error;

      // Collect all unique categories
      const allCategories = new Set<string>();
      
      // Add main categories
      data.forEach(item => {
        if (item.main_category) {
          allCategories.add(item.main_category);
        }
      });

      // Add secondary categories
      data.forEach(item => {
        if (Array.isArray(item.secondary_categories)) {
          item.secondary_categories.forEach((cat: string) => {
            allCategories.add(cat);
          });
        }
      });

      // Include current values if they're not in the database yet
      if (mainCategory) allCategories.add(mainCategory);
      secondaryCategories.forEach(cat => allCategories.add(cat));
      
      return Array.from(allCategories).filter(Boolean).sort();
    },
  });

  const handleMainCategoryChange = (value: string) => {
    if (value === "new") {
      setShowNewCategory(true);
    } else {
      onMainCategoryChange(value);
    }
  };

  const handleNewCategorySubmit = () => {
    if (newCategory.trim()) {
      onMainCategoryChange(newCategory.trim());
      setShowNewCategory(false);
      setNewCategory("");
    }
  };

  const handleAddSecondaryCategory = (category: string) => {
    if (!secondaryCategories.includes(category) && category !== mainCategory) {
      onSecondaryCategoriesChange([...secondaryCategories, category]);
    }
    setShowSecondaryInput(false);
  };

  const handleRemoveSecondaryCategory = (categoryToRemove: string) => {
    onSecondaryCategoriesChange(
      secondaryCategories.filter(cat => cat !== categoryToRemove)
    );
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="main-category" className="text-sm font-medium">Main Category</label>
        {showNewCategory ? (
          <NewCategoryForm
            value={newCategory}
            onChange={setNewCategory}
            onSubmit={handleNewCategorySubmit}
            onCancel={() => setShowNewCategory(false)}
          />
        ) : (
          <CategoryDropdown
            value={mainCategory}
            categories={categories || []}
            onValueChange={handleMainCategoryChange}
          />
        )}
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
          {showSecondaryInput ? (
            <CategoryDropdown
              value=""
              categories={categories?.filter(cat => 
                cat !== mainCategory && !secondaryCategories.includes(cat)
              ) || []}
              onValueChange={(value) => {
                if (value === "new") {
                  setShowNewCategory(true);
                  setShowSecondaryInput(false);
                } else {
                  handleAddSecondaryCategory(value);
                }
              }}
              placeholder="Select category..."
            />
          ) : (
            <button
              type="button"
              onClick={() => setShowSecondaryInput(true)}
              className="text-sm text-primary hover:text-primary/80"
            >
              + Add category
            </button>
          )}
        </div>
      </div>
    </div>
  );
}