import { useQuery } from "@tanstack/react-query";
import { ChatSession } from "../types/chat";
import { useFetchSessions } from "./useFetchSessions";

export const useSessionList = () => {
  const { fetchSessions } = useFetchSessions();

  return useQuery<ChatSession[]>({
    queryKey: ['chat-sessions'],
    queryFn: fetchSessions,
  });
};