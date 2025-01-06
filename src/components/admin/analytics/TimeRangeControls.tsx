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
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`justify-start text-left font-normal ${
                !customDateRange.from && "text-muted-foreground"
              }`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {customDateRange.from ? (
                customDateRange.to ? (
                  <>
                    {format(customDateRange.from, "LLL dd, y")} -{" "}
                    {format(customDateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(customDateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Custom date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-background" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={customDateRange.from}
              selected={{
                from: customDateRange.from,
                to: customDateRange.to,
              }}
              onSelect={(range) => {
                if (range?.from && range?.to) {
                  onCustomDateRangeChange(range);
                }
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        {(customDateRange.from || customDateRange.to) && (
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={onClearCustomDateRange}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}