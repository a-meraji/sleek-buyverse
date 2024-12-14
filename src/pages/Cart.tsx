import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X } from "lucide-react";

const Cart = () => {
  // Temporary mock data
  const cartItems = [
    {
      id: "1",
      name: "Classic White T-Shirt",
      price: 29.99,
      size: "M",
      quantity: 1,
      image: "/placeholder.svg",
    },
  ];

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-6 p-4 bg-secondary rounded-lg">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded"
                />
                
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{item.name}</h3>
                    <Button variant="ghost" size="icon">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <p className="text-sm text-gray-600">Size: {item.size}</p>
                  <p>${item.price.toFixed(2)}</p>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon">
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span>{item.quantity}</span>
                    <Button variant="outline" size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-secondary p-6 rounded-lg space-y-4">
              <h2 className="text-xl font-semibold">Order Summary</h2>
              
              <div className="flex justify-between py-4 border-t">
                <span>Total</span>
                <span className="font-medium">${total.toFixed(2)}</span>
              </div>
              
              <Button className="w-full" size="lg">
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