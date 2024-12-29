import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { ChatWindow } from "./ChatWindow";
import { useUnreadMessages } from "./hooks/useUnreadMessages";

export const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = useUnreadMessages();

  return (
    <>
      <Button
        className="fixed bottom-4 right-4 rounded-full size-12 shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="size-6" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive"
            className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center rounded-full p-0"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>
      <ChatWindow open={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};