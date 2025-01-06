import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Search, X } from "lucide-react";
import { format } from "date-fns";
import { OrderStatus } from "./OrderStatusSelect";
import { useState } from "react";

interface OrderFiltersProps {
  filters: {
    search: string;
    status: OrderStatus | "all";
    dateRange: {
      from?: Date;
      to?: Date;
    };
  };
  onFiltersChange: (filters: any) => void;
}

export function OrderFilters({ filters, onFiltersChange }: OrderFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search);

  const handleSearch = () => {
    onFiltersChange({ ...filters, search: searchInput });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearDate = (type: 'from' | 'to') => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [type]: undefined,
      },
    });
  };

  return (
    <div className="space-y-4 mb-4">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Input
              id="search"
              placeholder="Search by Order ID or Customer name"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pr-10"
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-0 top-0 h-full px-3 bg-gray-100 hover:bg-gray-200 transition-colors rounded-l-none"
              onClick={handleSearch}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="w-[200px]">
          <Label>Status</Label>
          <Select
            value={filters.status}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, status: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-[300px]">
          <Label>Date Range</Label>
          <div className="flex gap-2">
            <div className="relative">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-[130px] justify-start text-left font-normal bg-white truncate ${
                      !filters.dateRange.from && "text-muted-foreground"
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                    {filters.dateRange.from ? (
                      format(filters.dateRange.from, "PP")
                    ) : (
                      <span>From</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange.from}
                    onSelect={(date) =>
                      onFiltersChange({
                        ...filters,
                        dateRange: { ...filters.dateRange, from: date },
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {filters.dateRange.from && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-2 hover:bg-transparent"
                  onClick={() => clearDate('from')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="relative">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-[130px] justify-start text-left font-normal bg-white truncate ${
                      !filters.dateRange.to && "text-muted-foreground"
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                    {filters.dateRange.to ? (
                      format(filters.dateRange.to, "PP")
                    ) : (
                      <span>To</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange.to}
                    onSelect={(date) =>
                      onFiltersChange({
                        ...filters,
                        dateRange: { ...filters.dateRange, to: date },
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {filters.dateRange.to && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-2 hover:bg-transparent"
                  onClick={() => clearDate('to')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}