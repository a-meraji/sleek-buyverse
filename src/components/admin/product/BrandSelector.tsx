import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface BrandSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function BrandSelector({ value, onChange }: BrandSelectorProps) {
  const [newBrand, setNewBrand] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const { toast } = useToast();

  const { data: brands, refetch } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      console.log("Fetching brands");
      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching brands:", error);
        throw error;
      }

      return data;
    },
  });

  const handleAddBrand = async () => {
    if (!newBrand.trim()) {
      toast({
        title: "Error",
        description: "Brand name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("brands")
        .insert([{ name: newBrand.trim() }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Brand added successfully",
      });

      setNewBrand("");
      setIsAddingNew(false);
      refetch();
      onChange(newBrand.trim());
    } catch (error) {
      console.error("Error adding brand:", error);
      toast({
        title: "Error",
        description: "Failed to add brand. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor="brand" className="text-sm font-medium">
        Brand
      </label>
      {isAddingNew ? (
        <div className="flex gap-2">
          <Input
            value={newBrand}
            onChange={(e) => setNewBrand(e.target.value)}
            placeholder="Enter new brand name"
          />
          <Button type="button" onClick={handleAddBrand}>Add</Button>
          <Button type="button" variant="outline" onClick={() => setIsAddingNew(false)}>
            Cancel
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select brand" />
            </SelectTrigger>
            <SelectContent>
              {brands?.map((brand) => (
                <SelectItem key={brand.id} value={brand.name}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="button" variant="outline" onClick={() => setIsAddingNew(true)}>
            New Brand
          </Button>
        </div>
      )}
    </div>
  );
}