import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

      const uniqueCategories = [...new Set(data.map(item => item.category))].filter(Boolean);
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
        <div className="flex gap-2 bg-white">
          <Input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter new category"
          />
          <Button 
            type="button" 
            onClick={handleNewCategorySubmit}
            className="shrink-0"
          >
            Add
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setShowNewCategory(false)}
            className="shrink-0"
          >
            Cancel
          </Button>
        </div>
      ) : (
        <div className="flex gap-2 bg-white">
          <Select 
            value={value} 
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
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
        </div>
      )}
    </div>
  );
}
