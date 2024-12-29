import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send } from "lucide-react";

interface MessageInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const MessageInput = ({
  newMessage,
  setNewMessage,
  loading,
  onSubmit,
}: MessageInputProps) => {
  return (
    <div className="p-6 mt-auto border-t">
      <form onSubmit={onSubmit} className="flex gap-2">
        <Input
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={loading}
        />
        <Button type="submit" disabled={loading}>
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
        </Button>
      </form>
    </div>
  );
};