import { TableCell } from "@/components/ui/table";

interface ProductImageProps {
  imageUrl: string;
  productName: string;
}

export function ProductImage({ imageUrl, productName }: ProductImageProps) {
  return (
    <TableCell>
      <img
        src={imageUrl}
        alt={productName}
        className="h-12 w-12 object-cover rounded"
      />
    </TableCell>
  );
}