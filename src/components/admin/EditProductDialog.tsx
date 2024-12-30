import { useState, useEffect } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";
import { ImageSelector } from "./ImageSelector";
import { Image } from "lucide-react";

interface EditProductDialogProps {
  product: Product | null;
  onClose: () => void;
}

export function EditProductDialog({ product, onClose }: EditProductDialogProps) {
  const [formData, setFormData] = useState<Product | null>(null);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const updateProduct = useMutation({
    mutationFn: async () => {
      if (!formData) return;
      
      const { data, error } = await supabase
        .from("products")
        .update({
          name: formData.name,
          description: formData.description,
          price: formData.price,
          stock: formData.stock,
          category: formData.category,
          image_url: formData.image_url,
          sku: formData.sku,
        })
        .eq("id", formData.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
      onClose();
    },
    onError: (error) => {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (!product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProduct.mutate();
  };

  return (
    <>
      <Dialog open={!!product} onOpenChange={() => onClose()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <Input
                id="name"
                value={formData?.name ?? ""}
                onChange={(e) => setFormData(prev => prev ? { ...prev, name: e.target.value } : null)}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea
                id="description"
                value={formData?.description ?? ""}
                onChange={(e) => setFormData(prev => prev ? { ...prev, description: e.target.value } : null)}
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
                  onChange={(e) => setFormData(prev => prev ? { ...prev, price: Number(e.target.value) } : null)}
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
                  onChange={(e) => setFormData(prev => prev ? { ...prev, stock: Number(e.target.value) } : null)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">Category</label>
              <Input
                id="category"
                value={formData?.category ?? ""}
                onChange={(e) => setFormData(prev => prev ? { ...prev, category: e.target.value } : null)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Product Image</label>
              <div className="flex items-center gap-4">
                {formData?.image_url && (
                  <img
                    src={formData.image_url}
                    alt={formData.name}
                    className="h-20 w-20 object-cover rounded-lg"
                  />
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowImageSelector(true)}
                >
                  <Image className="h-4 w-4 mr-2" />
                  Choose Image
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="sku" className="text-sm font-medium">SKU</label>
              <Input
                id="sku"
                value={formData?.sku ?? ""}
                onChange={(e) => setFormData(prev => prev ? { ...prev, sku: e.target.value } : null)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateProduct.isPending}>
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ImageSelector
        open={showImageSelector}
        onClose={() => setShowImageSelector(false)}
        onSelect={(url) => setFormData(prev => prev ? { ...prev, image_url: url } : null)}
      />
    </>
  );
}