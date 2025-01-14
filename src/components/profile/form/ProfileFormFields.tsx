import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileFormFieldsProps {
  profile: {
    first_name: string;
    last_name: string;
    phone: string;
    street_address: string;
    city: string;
    state: string;
    postal_code: string;
  };
  setProfile: (profile: any) => void;
}

export function ProfileFormFields({ profile, setProfile }: ProfileFormFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="first_name">First Name</Label>
        <Input
          id="first_name"
          value={profile.first_name}
          onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="last_name">Last Name</Label>
        <Input
          id="last_name"
          value={profile.last_name}
          onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          value={profile.phone}
          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
        />
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="street_address">Street Address</Label>
        <Input
          id="street_address"
          value={profile.street_address}
          onChange={(e) => setProfile({ ...profile, street_address: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          value={profile.city}
          onChange={(e) => setProfile({ ...profile, city: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="state">State</Label>
        <Input
          id="state"
          value={profile.state}
          onChange={(e) => setProfile({ ...profile, state: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="postal_code">Postal Code</Label>
        <Input
          id="postal_code"
          value={profile.postal_code}
          onChange={(e) => setProfile({ ...profile, postal_code: e.target.value })}
        />
      </div>
    </div>
  );
}