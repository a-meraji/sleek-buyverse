import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface StatusSectionProps {
  value: boolean;
  onChange: (checked: boolean) => void;
}

export function StatusSection({ value, onChange }: StatusSectionProps) {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="status" checked={value} onCheckedChange={onChange} />
      <Label htmlFor="status">Active Campaign</Label>
    </div>
  );
}