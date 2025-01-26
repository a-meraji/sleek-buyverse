import { FC, useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface ProfileFormProps {
  userId: string;
  onClose: () => void;
}

export const ProfileForm: FC<ProfileFormProps> = ({ userId, onClose }) => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('name, email')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch user data.",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setName(data.name);
        setEmail(data.email);
      }
    };

    fetchUserData();
  }, [userId, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from('users')
      .update({ name, email })
      .eq('id', userId);

    if (error) {
      console.error('Error updating user data:', error);
      toast({
        title: "Error",
        description: "Failed to update user data.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "User data updated successfully.",
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full border rounded-md p-2"
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full border rounded-md p-2"
          required
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
};
