import { Filter, Grid } from "lucide-react";

interface ViewControlsProps {
  setMobileFiltersOpen: (open: boolean) => void;
}

export const ViewControls = ({ setMobileFiltersOpen }: ViewControlsProps) => {
  return (
    <div className="flex items-center justify-between md:justify-start gap-2">
      <button type="button" className="p-2 text-gray-400 hover:text-gray-500">
        <span className="sr-only">View grid</span>
        <Grid className="h-5 w-5" />
      </button>
      
      <button
        type="button"
        onClick={() => setMobileFiltersOpen(true)}
        className="p-2 text-gray-400 hover:text-gray-500 md:hidden"
      >
        <span className="sr-only">Filters</span>
        <Filter className="h-5 w-5" />
      </button>
    </div>
  );
};