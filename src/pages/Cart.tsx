import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const Cart = () => {
  const { state: { items, isLoading }, updateQuantity, removeItem, loadCartItems } = useCart();

  useEffect(() => {
    loadCartItems();
  }, [loadCartItems]);

  const handleQuantityChange = (id: string, currentQuantity: number, delta: number) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
  };

  const total = items?.reduce((sum, item) => {
    return sum + (item.product?.price ?? 0) * item.quantity;
  }, 0) ?? 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-[50vh]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {items?.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Your cart is empty</p>
            ) : (
              items?.map((item) => (
                <div key={item.id} className="flex gap-6 p-4 bg-secondary rounded-lg">
                  <img
                    src={item.product?.image_url}
                    alt={item.product?.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{item.product?.name}</h3>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeItem(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{item.product?.description}</p>
                    <p>${item.product?.price?.toFixed(2)}</p>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span>{item.quantity}</span>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-secondary p-6 rounded-lg space-y-4">
              <h2 className="text-xl font-semibold">Order Summary</h2>
              
              <div className="flex justify-between py-4 border-t">
                <span>Total</span>
                <span className="font-medium">${total.toFixed(2)}</span>
              </div>
              
              <Button 
                className="w-full" 
                size="lg"
                disabled={!items?.length}
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;