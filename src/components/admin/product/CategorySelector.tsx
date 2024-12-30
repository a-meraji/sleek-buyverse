import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CategoryDropdown } from "./CategoryDropdown";
import { NewCategoryForm } from "./NewCategoryForm";

interface CategorySelectorProps {
  value: string;
  onChange: (category: string) => void;
}

export function CategorySelector({ value, onChange }: CategorySelectorProps) {
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const { data: categories } = useQuery({
    queryKey: ["product-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("category")
        .not("category", "is", null);

      if (error) throw error;

      // Include the current value if it's not in the database yet
      const uniqueCategories = [...new Set([
        ...data.map(item => item.category),
        ...(value && !data.some(item => item.category === value) ? [value] : [])
      ])].filter(Boolean);
      
      return uniqueCategories;
    },
  });

  const handleCategoryChange = (value: string) => {
    if (value === "new") {
      setShowNewCategory(true);
    } else {
      onChange(value);
    }
  };

  const handleNewCategorySubmit = () => {
    if (newCategory.trim()) {
      onChange(newCategory.trim());
      setShowNewCategory(false);
      setNewCategory("");
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor="category" className="text-sm font-medium">Category</label>
      {showNewCategory ? (
        <NewCategoryForm
          value={newCategory}
          onChange={setNewCategory}
          onSubmit={handleNewCategorySubmit}
          onCancel={() => setShowNewCategory(false)}
        />
      ) : (
        <div className="flex gap-2 bg-white">
          <CategoryDropdown
            value={value}
            categories={categories || []}
            onValueChange={handleCategoryChange}
          />
        </div>
      )}
    </div>
  );
}