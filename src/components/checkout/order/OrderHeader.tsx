import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const OrderHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center gap-4 mb-6">
      <Button 
        variant="outline" 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      <h2 className="text-xl font-semibold">Order Summary</h2>
    </div>
  );
};