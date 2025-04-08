import {
  ChatBoxProviderContext,
  ChatBoxProviderProps,
} from "@/lib/context/chat-box-context";
import React, { useMemo, useState } from "react";

export const ChatBoxProvider: React.FC<ChatBoxProviderProps> = ({
  children,
  ...props
}) => {
  const [isChatBoxOpened, setIsChatBoxOpened] = useState(false);
  const [currentlyChattingUserId, setCurrentlyChattingUserId] = useState<
    string | null
  >(null);

  const value = useMemo(
    () => ({
      isChatBoxOpened,
      currentlyChattingUserId,
      setIsChatBoxOpened: (isOpened: boolean) => {
        setIsChatBoxOpened(isOpened);
      },
      setCurrentlyChattingUserId: (userId: string | null) => {
        setCurrentlyChattingUserId(userId);
      },
    }),
    [isChatBoxOpened, currentlyChattingUserId]
  );

  return (
    <ChatBoxProviderContext.Provider
      {...props}
      value={value}>
      {children}
    </ChatBoxProviderContext.Provider>
  );
};
