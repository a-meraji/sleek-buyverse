import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  error: Error;
}

export const ErrorState = ({ error }: ErrorStateProps) => (
  <div className="container mx-auto px-4 py-8">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-destructive mb-4">
        Error loading products
      </h2>
      <p className="text-muted-foreground mb-4">
        {error.message}
      </p>
      <Button 
        onClick={() => window.location.reload()}
        variant="outline"
      >
        Refresh Page
      </Button>
    </div>
  </div>
);