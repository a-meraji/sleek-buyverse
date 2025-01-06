import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "@/components/navbar/ProfileForm";
import { FavoritesList } from "@/components/navbar/FavoritesList";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
        return;
      }
      setUser(session.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Fetch user orders with items and product details
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['user-orders', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      console.log('Fetching orders for user:', user.id);
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product: products (*),
            variant: product_variants (*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }

      console.log('Fetched orders:', data);
      return data;
    },
    enabled: !!user?.id,
  });

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      localStorage.clear();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      
      navigate('/');
    } catch (err) {
      console.error("Error signing out:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Profile</h1>
          
          <Tabs defaultValue="info" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-secondary">
              <TabsTrigger 
                value="info"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Information
              </TabsTrigger>
              <TabsTrigger 
                value="orders"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Orders
              </TabsTrigger>
              <TabsTrigger 
                value="favorites"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Favorites
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-6">
              <ProfileForm userId={user.id} onClose={() => {}} />
              <Button 
                variant="destructive" 
                className="w-full bg-red-600 hover:bg-red-700"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </TabsContent>

            <TabsContent value="orders" className="space-y-4">
              {ordersLoading ? (
                <div className="text-center py-8">Loading orders...</div>
              ) : orders?.length ? (
                <Accordion type="single" collapsible className="space-y-4">
                  {orders.map((order) => (
                    <AccordionItem key={order.id} value={order.id} className="border rounded-lg p-4">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex justify-between items-center w-full">
                          <div>
                            <p className="font-medium text-left">Order #{order.id.slice(0, 8)}</p>
                            <p className="text-sm text-gray-500 text-left">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${order.total_amount}</p>
                            <Badge variant={
                              order.status === 'shipped' ? 'default' :
                              order.status === 'processing' ? 'secondary' : 'outline'
                            }>
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="mt-4 space-y-4">
                          {order.order_items?.map((item: any) => (
                            <div key={item.id} className="flex items-center justify-between border-b pb-4">
                              <div className="flex items-center space-x-4">
                                <img
                                  src={item.product.image_url}
                                  alt={item.product.name}
                                  className="w-16 h-16 object-cover rounded"
                                />
                                <div>
                                  <p className="font-medium">{item.product.name}</p>
                                  {item.variant && (
                                    <p className="text-sm text-gray-500">
                                      Size: {item.variant.size}, Color: {item.variant.color}
                                    </p>
                                  )}
                                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                </div>
                              </div>
                              <p className="font-medium">${item.price_at_time}</p>
                            </div>
                          ))}
                          {order.shipping_address && (
                            <div className="mt-4">
                              <h4 className="font-medium mb-2">Shipping Address</h4>
                              <p className="text-sm text-gray-500">
                                {order.shipping_address.street}<br />
                                {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}
                              </p>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No orders found
                </div>
              )}
            </TabsContent>

            <TabsContent value="favorites">
              <FavoritesList userId={user.id} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Profile;