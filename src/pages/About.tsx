import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const About = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleDashboardAccess = async () => {
    setIsLoading(true);
    try {
      // Sign out current user if any
      await supabase.auth.signOut();
      
      // Sign in with admin credentials
      const { error } = await supabase.auth.signInWithPassword({
        email: 'admin@admin.com',
        password: '123123'
      });

      if (error) {
        console.error('Login error:', error);
        toast({
          title: "Error",
          description: "Failed to access dashboard. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Accessing admin dashboard...",
      });
      navigate('/admin');
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">About Our E-commerce Platform</h1>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-medium">Real-time Customer Support</h3>
              <p className="text-muted-foreground">
                Experience instant communication with our customer service team through our
                real-time chat feature. Get immediate responses and personalized assistance
                for all your shopping needs.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-medium">Admin Dashboard</h3>
              <p className="text-muted-foreground">
                A powerful yet intuitive admin dashboard for managing products, orders,
                and customer interactions. Monitor sales, track inventory, and handle
                customer support all in one place.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Technical Features</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Real-time chat system with message status tracking</li>
            <li>Secure authentication and user management</li>
            <li>Responsive design for all devices</li>
            <li>Advanced product search and filtering</li>
            <li>Real-time inventory management</li>
            <li>Secure payment processing</li>
          </ul>
        </section>

        <div className="mt-8">
          <Button 
            onClick={handleDashboardAccess}
            className="bg-[#1d8757] hover:bg-[#1d8757]/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Accessing Dashboard...
              </>
            ) : (
              'Access Admin Dashboard'
            )}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default About;