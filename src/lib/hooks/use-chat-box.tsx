import {
  ChatBoxProviderContext,
  ChatBoxProviderState,
} from "@/lib/context/chat-box-context";
import { useContext } from "react";

export const useChatBox = () => {
  const context = useContext(ChatBoxProviderContext) as
    | ChatBoxProviderState
    | undefined;

  if (context === undefined)
    throw new Error("useChatBox must be used within a ChatBoxProvider");

  return context;
};
