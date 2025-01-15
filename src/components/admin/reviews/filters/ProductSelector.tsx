import { useState } from "react";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductSelectorProps {
  products: Pick<Product, "id" | "name">[];
  selectedProduct: string | null;
  onProductChange: (value: string | null) => void;
}

export function ProductSelector({ 
  products = [], 
  selectedProduct, 
  onProductChange 
}: ProductSelectorProps) {
  const [open, setOpen] = useState(false);
  console.log("ProductSelector render:", { products, selectedProduct });

  // Ensure we have a valid array of products
  const validProducts = Array.isArray(products) ? products : [];
  const selectedProductName = validProducts.find(p => p.id === selectedProduct)?.name || "All Products";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedProductName}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search products..." />
          <CommandEmpty>No product found.</CommandEmpty>
          <CommandGroup>
            <CommandItem
              value="all"
              onSelect={() => {
                onProductChange(null);
                setOpen(false);
              }}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  !selectedProduct ? "opacity-100" : "opacity-0"
                )}
              />
              All Products
            </CommandItem>
            {validProducts.map((product) => (
              <CommandItem
                key={product.id}
                value={product.name}
                onSelect={() => {
                  onProductChange(product.id);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedProduct === product.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {product.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}