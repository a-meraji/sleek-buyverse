import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";

export const ErrorState = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-destructive mb-4">
              Error loading products
            </h2>
            <p className="text-muted-foreground mb-4">
              Please try refreshing the page
            </p>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
            >
              Refresh Page
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};