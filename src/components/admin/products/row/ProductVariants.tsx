import { TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ProductVariant } from "@/types/variant";
import { cn } from "@/lib/utils";

interface ProductVariantsProps {
  variants: ProductVariant[];
  isExpanded: boolean;
  onExpand: (e: React.MouseEvent) => void;
}

export function ProductVariants({ variants, isExpanded, onExpand }: ProductVariantsProps) {
  return (
    <TableCell>
      <div className="relative">
        <div 
          className={cn(
            "flex flex-wrap gap-1 transition-all duration-300",
            !isExpanded && "max-h-8 overflow-hidden"
          )}
        >
          {variants.map((variant) => (
            <Badge 
              key={`${variant.id}`} 
              variant="secondary"
              className="whitespace-nowrap"
            >
              {variant.color} - {variant.size} (${variant.price})
            </Badge>
          ))}
        </div>
        {variants.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onExpand}
            className="absolute -bottom-2 right-0 h-6 w-6 p-0"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
    </TableCell>
  );
}