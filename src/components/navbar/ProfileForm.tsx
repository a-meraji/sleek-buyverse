import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProfileFormProps {
  userId: string;
  onClose: () => void;
}

export function ProfileForm({ userId, onClose }: ProfileFormProps) {
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    street_address: "",
    city: "",
    state: "",
    postal_code: "",
  });
  const [initialProfile, setInitialProfile] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    street_address: "",
    city: "",
    state: "",
    postal_code: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        const profileData = {
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          phone: data.phone || "",
          street_address: data.street_address || "",
          city: data.city || "",
          state: data.state || "",
          postal_code: data.postal_code || "",
        };
        setProfile(profileData);
        setInitialProfile(profileData);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone: profile.phone,
          street_address: profile.street_address,
          city: profile.city,
          state: profile.state,
          postal_code: profile.postal_code,
        });

      if (error) throw error;

      setInitialProfile(profile);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const hasChanges = JSON.stringify(profile) !== JSON.stringify(initialProfile);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          value={profile.phone}
          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
        />
      </div>
      <div>
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
      {hasChanges && (
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setProfile(initialProfile)}>
            Cancel
          </Button>
          <Button type="submit">
            Save Changes
          </Button>
        </div>
      )}
    </form>
  );
}