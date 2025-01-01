import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  first_name: string;
  last_name: string;
  phone: string;
  shipping_address: string;
}

export function useProfile(userId: string) {
  const [profile, setProfile] = useState<Profile>({
    first_name: "",
    last_name: "",
    phone: "",
    shipping_address: "",
  });
  const [initialProfile, setInitialProfile] = useState<Profile>({
    first_name: "",
    last_name: "",
    phone: "",
    shipping_address: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    const fetchProfile = async () => {
      try {
        console.log('useProfile: Fetching profile for user:', userId);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        console.log('useProfile: Profile fetch response:', { data, error });

        if (!mounted) return;

        if (error) {
          console.error('useProfile: Error fetching profile:', error);
          toast({
            title: "Error loading profile",
            description: "Failed to load your profile information.",
            variant: "destructive",
          });
          return;
        }

        const profileData = {
          first_name: data?.first_name || "",
          last_name: data?.last_name || "",
          phone: data?.phone || "",
          shipping_address: data?.shipping_address ? JSON.stringify(data.shipping_address, null, 2) : "",
        };

        if (data) {
          console.log('useProfile: Setting existing profile data:', profileData);
        } else {
          console.log('useProfile: No profile found, using default profile');
        }

        setProfile(profileData);
        setInitialProfile(profileData);
      } catch (error) {
        console.error('useProfile: Unexpected error:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred while loading your profile.",
          variant: "destructive",
        });
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProfile();
    return () => {
      mounted = false;
    };
  }, [userId, toast]);

  const updateProfile = async () => {
    console.log('useProfile: Submitting profile update');

    try {
      let parsedAddress;
      try {
        parsedAddress = profile.shipping_address ? JSON.parse(profile.shipping_address) : null;
      } catch (error) {
        console.error('useProfile: Invalid address format:', error);
        toast({
          title: "Invalid address format",
          description: "Please enter a valid JSON address format",
          variant: "destructive",
        });
        return false;
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
        console.error('useProfile: Error updating profile:', error);
        throw error;
      }

      console.log('useProfile: Profile updated successfully');
      setInitialProfile(profile);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
      return true;
    } catch (error) {
      console.error('useProfile: Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    profile,
    setProfile,
    initialProfile,
    isLoading,
    updateProfile,
    hasChanges: JSON.stringify(profile) !== JSON.stringify(initialProfile),
    resetProfile: () => setProfile(initialProfile),
  };
}