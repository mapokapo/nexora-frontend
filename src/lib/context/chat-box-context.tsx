import { createContext, PropsWithChildren } from "react";

export type ChatBoxProviderProps = PropsWithChildren & {};

export interface ChatBoxProviderState {
  isChatBoxOpened: boolean;
  currentlyChattingUserId: string | null;
  setIsChatBoxOpened: (isOpened: boolean) => void;
  setCurrentlyChattingUserId: (userId: string | null) => void;
}

export const initialState: ChatBoxProviderState = {
  isChatBoxOpened: false,
  currentlyChattingUserId: null,
  setIsChatBoxOpened: () => null,
  setCurrentlyChattingUserId: () => null,
};

export const ChatBoxProviderContext =
  createContext<ChatBoxProviderState>(initialState);
