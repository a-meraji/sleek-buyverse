import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UseFormRegister } from "react-hook-form";
import { CampaignFormData } from "../types";

interface DateSectionProps {
  register: UseFormRegister<CampaignFormData>;
}

export function DateSection({ register }: DateSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="start_date">Start Date</Label>
        <Input
          id="start_date"
          type="datetime-local"
          {...register("start_date", { required: true })}
        />
      </div>
      <div>
        <Label htmlFor="end_date">End Date</Label>
        <Input
          id="end_date"
          type="datetime-local"
          {...register("end_date", { required: true })}
        />
      </div>
    </div>
  );
}