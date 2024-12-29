import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChatWindow } from "./ChatWindow";

export const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        className="fixed bottom-4 right-4 rounded-full size-12 shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="size-6" />
      </Button>
      <ChatWindow open={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};