import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useChatSession = (open: boolean, onClose: () => void) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    const initializeChat = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('User not authenticated, showing sign in message');
        toast({
          title: "Please sign in",
          description: "You need to be signed in to chat with customer service.",
          variant: "destructive",
        });
        onClose();
        navigate('/auth');
        return;
      }

      console.log('Checking for existing chat session for user:', session.user.id);
      
      const { data: existingSession, error: fetchError } = await supabase
        .from('chat_sessions')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching chat session:', fetchError);
        return;
      }

      if (existingSession) {
        console.log('Found existing chat session:', existingSession);
        setSessionId(existingSession.id);
      } else {
        console.log('No existing session found, creating new chat session...');
        const { data: newSession, error: createError } = await supabase
          .from('chat_sessions')
          .insert({ user_id: session.user.id })
          .select()
          .maybeSingle();

        if (createError) {
          console.error('Error creating chat session:', createError);
          return;
        }
        console.log('Created new chat session:', newSession);
        if (newSession) {
          setSessionId(newSession.id);
        }
      }
    };

    if (open) {
      initializeChat();
    }
  }, [open, toast, onClose, navigate]);

  const { data: messages = [] } = useQuery({
    queryKey: ['chat-messages', sessionId],
    queryFn: async () => {
      if (!sessionId) return [];
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return [];
      }
      return data;
    },
    enabled: !!sessionId,
    refetchInterval: 3000,
  });

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !sessionId) return;

    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to send messages.",
        variant: "destructive",
      });
      setLoading(false);
      onClose();
      navigate('/auth');
      return;
    }

    const { error } = await supabase
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        content: newMessage.trim(),
        sender_id: session.user.id,
      });

    setLoading(false);
    if (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setNewMessage("");
    queryClient.invalidateQueries({ queryKey: ['chat-messages', sessionId] });
  };

  return {
    sessionId,
    messages,
    newMessage,
    setNewMessage,
    loading,
    sendMessage,
  };
};