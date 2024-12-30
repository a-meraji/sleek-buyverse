import { useState } from "react";
import { Product } from "@/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImagePreview } from "./ImagePreview";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductFormProps {
  formData: Product;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (updates: Partial<Product>) => void;
  onCancel: () => void;
  onChooseImage: () => void;
}

export function ProductForm({
  formData,
  isSubmitting,
  onSubmit,
  onChange,
  onCancel,
  onChooseImage,
}: ProductFormProps) {
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

      // Get unique categories and remove nulls
      const uniqueCategories = [...new Set(data.map(item => item.category))].filter(Boolean);
      return uniqueCategories;
    },
  });

  const handleCategoryChange = (value: string) => {
    if (value === "new") {
      setShowNewCategory(true);
    } else {
      onChange({ category: value });
    }
  };

  const handleNewCategorySubmit = () => {
    if (newCategory.trim()) {
      onChange({ category: newCategory.trim() });
      setShowNewCategory(false);
      setNewCategory("");
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">Name</label>
        <Input
          id="name"
          value={formData?.name ?? ""}
          onChange={(e) => onChange({ name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">Description</label>
        <Textarea
          id="description"
          value={formData?.description ?? ""}
          onChange={(e) => onChange({ description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="price" className="text-sm font-medium">Price</label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={formData?.price ?? ""}
            onChange={(e) => onChange({ price: Number(e.target.value) })}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="stock" className="text-sm font-medium">Stock</label>
          <Input
            id="stock"
            type="number"
            min="0"
            value={formData?.stock ?? ""}
            onChange={(e) => onChange({ stock: Number(e.target.value) })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="category" className="text-sm font-medium">Category</label>
        {showNewCategory ? (
          <div className="flex gap-2">
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
          <div className="flex gap-2">
            <Select 
              value={formData?.category ?? ""} 
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

      <ImagePreview
        imageUrl={formData?.image_url}
        productName={formData?.name}
        onChooseImage={onChooseImage}
      />

      <div className="space-y-2">
        <label htmlFor="sku" className="text-sm font-medium">SKU</label>
        <Input
          id="sku"
          value={formData?.sku ?? ""}
          onChange={(e) => onChange({ sku: e.target.value })}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Save Changes
        </Button>
      </div>
    </form>
  );
}