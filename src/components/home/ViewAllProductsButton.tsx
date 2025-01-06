import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Grid } from "lucide-react";

export const ViewAllProductsButton = () => {
  return (
    <div className="py-16 px-6 text-center">
      <Link to="/products">
        <Button className="bg-[#1d8757] hover:bg-[#1d8757]/90 text-white px-8 py-6 rounded-full text-lg">
          <Grid className="mr-2 h-5 w-5" />
          View All Products
        </Button>
      </Link>
    </div>
  );
};