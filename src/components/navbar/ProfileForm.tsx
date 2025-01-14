import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProfileFormFields } from "../profile/form/ProfileFormFields";
import { ProfileFormActions } from "../profile/form/ProfileFormActions";

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
      <ProfileFormFields profile={profile} setProfile={setProfile} />
      <ProfileFormActions 
        hasChanges={hasChanges} 
        onCancel={() => setProfile(initialProfile)} 
      />
    </form>
  );
}