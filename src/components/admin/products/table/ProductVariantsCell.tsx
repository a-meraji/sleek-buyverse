import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell } from "@/components/ui/table";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ProductVariant } from "@/types/variant";
import { cn } from "@/lib/utils";

interface ProductVariantsCellProps {
  variants: ProductVariant[];
  isExpanded: boolean;
  onExpand: () => void;
}

export function ProductVariantsCell({ 
  variants, 
  isExpanded, 
  onExpand 
}: ProductVariantsCellProps) {
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
              {variant.parameters.color} - {variant.parameters.size} (${variant.price})
            </Badge>
          ))}
        </div>
        {variants.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onExpand();
            }}
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