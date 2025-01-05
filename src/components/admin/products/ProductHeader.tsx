import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { ProductForm } from "../product/form/ProductForm";

export function ProductHeader() {
  const [showAddDialog, setShowAddDialog] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Products</h2>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-3xl">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Add New Product</h2>
            <ProductForm onClose={() => setShowAddDialog(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}