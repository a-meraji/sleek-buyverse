import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ChatHeader } from "./components/ChatHeader";
import { MessageList } from "./components/MessageList";
import { MessageInput } from "./components/MessageInput";
import { useChatSession } from "./hooks/useChatSession";

interface ChatWindowProps {
  open: boolean;
  onClose: () => void;
}

export const ChatWindow = ({ open, onClose }: ChatWindowProps) => {
  const {
    messages,
    newMessage,
    setNewMessage,
    loading,
    sendMessage,
  } = useChatSession(open, onClose);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col h-full p-0">
        <div className="flex flex-col h-full">
          <ChatHeader />
          <MessageList messages={messages} />
          <MessageInput
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            loading={loading}
            onSubmit={sendMessage}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};