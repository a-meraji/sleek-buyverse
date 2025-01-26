import { useState } from "react";
import { Plus, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  isMainCategory?: boolean;
}

function CategoryDropdown({
  value,
  categories,
  onValueChange,
  placeholder = "Select a category",
  isMainCategory = false
}: CategoryDropdownProps) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const handleNewCategory = () => {
    if (newCategory.trim()) {
      onValueChange(newCategory.trim());
      setNewCategory("");
      setIsAddingNew(false);
    }
  };

  if (isAddingNew) {
    return (
      <div className="flex gap-2">
        <Input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Enter new category"
          className="bg-white"
        />
        <Button onClick={handleNewCategory} size="sm">Add</Button>
        <Button 
          onClick={() => setIsAddingNew(false)} 
          variant="outline" 
          size="sm"
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Select value={value} onValueChange={(val) => {
      if (val === "new") {
        setIsAddingNew(true);
      } else {
        onValueChange(val);
      }
    }}>
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
  // Fetch existing categories
  const { data: existingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data: products } = await supabase
        .from("products")
        .select("main_category, secondary_categories");
      
      const mainCategories = new Set<string>();
      const secondaryCategories = new Set<string>();
      
      products?.forEach(product => {
        if (product.main_category) {
          mainCategories.add(product.main_category);
        }
        if (Array.isArray(product.secondary_categories)) {
          product.secondary_categories.forEach((cat: string) => {
            secondaryCategories.add(cat);
          });
        }
      });
      
      return {
        mainCategories: Array.from(mainCategories),
        secondaryCategories: Array.from(secondaryCategories)
      };
    }
  });

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
          categories={existingCategories?.mainCategories || []}
          onValueChange={onMainCategoryChange}
          isMainCategory={true}
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
            categories={existingCategories?.secondaryCategories || []}
            onValueChange={handleAddSecondaryCategory}
            placeholder="Add secondary category..."
          />
        </div>
      </div>
    </div>
  );
}