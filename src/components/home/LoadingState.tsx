import { Loader2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";

export const LoadingState = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </main>
    </div>
  );
};