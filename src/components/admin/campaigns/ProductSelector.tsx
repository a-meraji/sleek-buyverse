import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface ProductSelectorProps {
  selectedProducts: string[];
  onProductsChange: (products: string[]) => void;
}

export function ProductSelector({ selectedProducts = [], onProductsChange }: ProductSelectorProps) {
  const [open, setOpen] = useState(false);

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      console.log('Fetching products for selector');
      const { data, error } = await supabase
        .from('products')
        .select('id, name, image_url');
      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      console.log('Fetched products:', data);
      return data || [];
    },
  });

  const toggleProduct = (productId: string) => {
    console.log('Toggling product:', productId);
    const newSelection = selectedProducts.includes(productId)
      ? selectedProducts.filter(id => id !== productId)
      : [...selectedProducts, productId];
    console.log('New selection:', newSelection);
    onProductsChange(newSelection);
  };

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedProducts.length > 0
              ? `${selectedProducts.length} products selected`
              : "Select products..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0">
          <Command>
            <CommandInput placeholder="Search products..." />
            <CommandEmpty>No products found.</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="h-72">
                {(products || []).map((product) => (
                  <CommandItem
                    key={product.id}
                    onSelect={() => toggleProduct(product.id)}
                    className="flex items-center gap-2"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedProducts.includes(product.id)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-8 h-8 object-cover rounded"
                    />
                    {product.name}
                  </CommandItem>
                ))}
              </ScrollArea>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedProducts.length > 0 && products && (
        <div className="flex flex-wrap gap-2">
          {products
            .filter(p => selectedProducts.includes(p.id))
            .map(product => (
              <Badge
                key={product.id}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => toggleProduct(product.id)}
              >
                {product.name}
              </Badge>
            ))}
        </div>
      )}
    </div>
  );
}