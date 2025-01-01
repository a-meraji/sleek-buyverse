import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
    shipping_address: "",
  });
  const [initialProfile, setInitialProfile] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    shipping_address: "",
  });
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log('ProfileForm: Fetching profile for user:', userId);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        console.log('ProfileForm: Profile fetch response:', { data, error });

        if (error) {
          console.error('ProfileForm: Error fetching profile:', error);
          toast({
            title: "Error loading profile",
            description: "Failed to load your profile information.",
            variant: "destructive",
          });
          return;
        }

        if (data) {
          const profileData = {
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            phone: data.phone || "",
            shipping_address: data.shipping_address ? JSON.stringify(data.shipping_address, null, 2) : "",
          };
          console.log('ProfileForm: Setting profile data:', profileData);
          setProfile(profileData);
          setInitialProfile(profileData);
        } else {
          console.log('ProfileForm: No profile found, creating new profile');
          // If no profile exists, we'll create one when the user saves
          const defaultProfile = {
            first_name: "",
            last_name: "",
            phone: "",
            shipping_address: "",
          };
          setProfile(defaultProfile);
          setInitialProfile(defaultProfile);
        }
      } catch (error) {
        console.error('ProfileForm: Unexpected error:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred while loading your profile.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('ProfileForm: Submitting profile update');

    try {
      let parsedAddress;
      try {
        parsedAddress = profile.shipping_address ? JSON.parse(profile.shipping_address) : null;
      } catch (error) {
        console.error('ProfileForm: Invalid address format:', error);
        toast({
          title: "Invalid address format",
          description: "Please enter a valid JSON address format",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone: profile.phone,
          shipping_address: parsedAddress,
        });

      if (error) {
        console.error('ProfileForm: Error updating profile:', error);
        throw error;
      }

      console.log('ProfileForm: Profile updated successfully');
      setInitialProfile(profile);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
      onClose();
    } catch (error) {
      console.error('ProfileForm: Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const hasChanges = JSON.stringify(profile) !== JSON.stringify(initialProfile);

  if (isLoading) {
    return <div className="p-4 text-center">Loading profile...</div>;
  }

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
        <Label htmlFor="shipping_address">Shipping Address (JSON format)</Label>
        <Textarea
          id="shipping_address"
          value={profile.shipping_address}
          onChange={(e) => setProfile({ ...profile, shipping_address: e.target.value })}
          rows={4}
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