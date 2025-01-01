import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ProfileFormFieldsProps {
  profile: {
    first_name: string;
    last_name: string;
    phone: string;
    shipping_address: string;
  };
  onChange: (field: string, value: string) => void;
}

export function ProfileFormFields({ profile, onChange }: ProfileFormFieldsProps) {
  return (
    <>
      <div>
        <Label htmlFor="first_name">First Name</Label>
        <Input
          id="first_name"
          value={profile.first_name}
          onChange={(e) => onChange("first_name", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="last_name">Last Name</Label>
        <Input
          id="last_name"
          value={profile.last_name}
          onChange={(e) => onChange("last_name", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={profile.phone}
          onChange={(e) => onChange("phone", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="shipping_address">Shipping Address (JSON format)</Label>
        <Textarea
          id="shipping_address"
          value={profile.shipping_address}
          onChange={(e) => onChange("shipping_address", e.target.value)}
          rows={4}
        />
      </div>
    </>
  );
}