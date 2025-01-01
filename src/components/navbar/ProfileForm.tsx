import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";
import { ProfileFormFields } from "./ProfileFormFields";

interface ProfileFormProps {
  userId: string;
  onClose: () => void;
}

export function ProfileForm({ userId, onClose }: ProfileFormProps) {
  const {
    profile,
    setProfile,
    isLoading,
    updateProfile,
    hasChanges,
    resetProfile,
  } = useProfile(userId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateProfile();
    if (success) {
      onClose();
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading profile...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ProfileFormFields
        profile={profile}
        onChange={handleFieldChange}
      />
      {hasChanges && (
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={resetProfile}>
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