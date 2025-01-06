import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";

interface TimeRangeControlsProps {
  timeRange: string;
  customDateRange: { from?: Date; to?: Date };
  onTimeRangeChange: (value: string) => void;
  onCustomDateRangeChange: (range: { from?: Date; to?: Date }) => void;
  onClearCustomDateRange: () => void;
}

export function TimeRangeControls({
  timeRange,
  customDateRange,
  onTimeRangeChange,
  onCustomDateRangeChange,
  onClearCustomDateRange,
}: TimeRangeControlsProps) {
  const clearDate = (type: 'from' | 'to') => {
    onCustomDateRangeChange({
      ...customDateRange,
      [type]: undefined,
    });
  };

  return (
    <div className="flex justify-end mb-4 gap-4">
      <Select 
        value={timeRange} 
        onValueChange={onTimeRangeChange}
        disabled={!!(customDateRange.from && customDateRange.to)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select time range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7">Last 7 days</SelectItem>
          <SelectItem value="30">Last 30 days</SelectItem>
          <SelectItem value="90">Last 90 days</SelectItem>
          <SelectItem value="180">Last 180 days</SelectItem>
          <SelectItem value="365">Last 365 days</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2">
        <div className="relative flex items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-[130px] pl-2 pr-8 justify-start text-left font-normal ${
                  !customDateRange.from && "text-muted-foreground"
                }`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {customDateRange.from ? (
                  format(customDateRange.from, "PP")
                ) : (
                  "From"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={customDateRange.from}
                onSelect={(date) =>
                  onCustomDateRangeChange({
                    ...customDateRange,
                    from: date,
                  })
                }
                initialFocus
                className="rounded-md border bg-white dark:bg-gray-800"
              />
            </PopoverContent>
          </Popover>
          {customDateRange.from && (
            <Button
              variant="ghost"
              size="icon"
              className="ml-1 h-8 w-8 p-0"
              onClick={() => clearDate('from')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="relative flex items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-[130px] pl-2 pr-8 justify-start text-left font-normal ${
                  !customDateRange.to && "text-muted-foreground"
                }`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {customDateRange.to ? (
                  format(customDateRange.to, "PP")
                ) : (
                  "To"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={customDateRange.to}
                onSelect={(date) =>
                  onCustomDateRangeChange({
                    ...customDateRange,
                    to: date,
                  })
                }
                initialFocus
                className="rounded-md border bg-white dark:bg-gray-800"
              />
            </PopoverContent>
          </Popover>
          {customDateRange.to && (
            <Button
              variant="ghost"
              size="icon"
              className="ml-1 h-8 w-8 p-0"
              onClick={() => clearDate('to')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}