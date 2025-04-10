import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { firestore } from "@/lib/firebase";
import { useChatBox } from "@/lib/hooks/use-chat-box";
import { useAppUser } from "@/lib/hooks/use-user";
import AsyncValue from "@/lib/types/AsyncValue";
import { Message, messageSchema } from "@/lib/types/Message";
import { Profile, profileSchema } from "@/lib/types/Profile";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  addDoc,
  and,
  collection,
  doc,
  onSnapshot,
  or,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { ChevronDown, ChevronUp, Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router";

const ChatBoxView: React.FC = () => {
  const user = useAppUser();
  const { isChatBoxOpened, setIsChatBoxOpened, currentlyChattingUserId } =
    useChatBox();
  const [profile, setProfile] = useState<AsyncValue<Profile>>({
    loaded: false,
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const chatBoxMessageListRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (currentlyChattingUserId === null) {
      setProfile({ loaded: false });
      return;
    }

    return onSnapshot(
      doc(firestore, "profiles", currentlyChattingUserId),
      snapshot => {
        if (snapshot.exists()) {
          const result = profileSchema.safeParse({
            id: currentlyChattingUserId,
            ...snapshot.data(),
          });

          if (!result.success) {
            console.error(result.error.errors);
            return;
          }

          setProfile({
            loaded: true,
            data: result.data,
          });
        }
      }
    );
  }, [currentlyChattingUserId]);

  useEffect(() => {
    if (currentlyChattingUserId === null) {
      setMessages([]);
      return;
    }

    return onSnapshot(
      query(
        collection(firestore, "messages"),
        or(
          and(
            where("senderId", "==", user.uid),
            where("receiverId", "==", currentlyChattingUserId)
          ),
          and(
            where("senderId", "==", currentlyChattingUserId),
            where("receiverId", "==", user.uid)
          )
        )
      ),
      snapshot => {
        snapshot.docChanges().forEach(change => {
          const result = messageSchema.safeParse({
            id: change.doc.id,
            ...change.doc.data(),
          });

          if (!result.success) {
            console.error(result.error.errors);
            return;
          }

          const message = result.data;

          switch (change.type) {
            case "added":
              setMessages(messages => [...messages, message]);
              break;
            case "modified":
              setMessages(messages =>
                messages.map(m => (m.id === message.id ? message : m))
              );
              break;
            case "removed":
              setMessages(messages =>
                messages.filter(m => m.id !== message.id)
              );
              break;
          }
        });
      }
    );
  }, [currentlyChattingUserId, user.uid]);

  useEffect(() => {
    if (chatBoxMessageListRef.current) {
      chatBoxMessageListRef.current.scrollTop =
        chatBoxMessageListRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (message.trim() === "") return;

    try {
      await addDoc(collection(firestore, "messages"), {
        content: message,
        senderId: user.uid,
        receiverId: currentlyChattingUserId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="fixed bottom-0 right-0 flex h-min min-w-56 flex-col border-l border-t border-border bg-card">
      <Button
        variant="ghost"
        onClick={() => setIsChatBoxOpened(!isChatBoxOpened)}
        className="flex h-min w-full justify-between rounded-none px-4 py-4 hover:bg-muted">
        <span
          className={cn("text-muted-foreground", {
            "text-foreground": profile.loaded,
          })}>
          {currentlyChattingUserId === null
            ? "Chat"
            : profile.loaded
              ? profile.data.name
              : "Loading..."}
        </span>
        {isChatBoxOpened ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronUp className="h-4 w-4" />
        )}
      </Button>
      {isChatBoxOpened && (
        <div className="flex h-96 w-96 flex-col gap-4 rounded-lg bg-card">
          {currentlyChattingUserId === null ? (
            <span className="text-muted-foreground">
              Select a user to chat with in the right sidebar
            </span>
          ) : (
            <div className="flex h-full w-full flex-col">
              {messages.length === 0 ? (
                <span className="p-2 text-center text-muted-foreground">
                  No messages yet. Start chatting!
                </span>
              ) : (
                <ul
                  ref={chatBoxMessageListRef}
                  className="flex flex-col gap-1 overflow-y-auto px-4 py-2">
                  {messages.map((message, i) => (
                    <li
                      key={message.id}
                      className={cn(
                        "flex w-full max-w-[70%] flex-col rounded-lg bg-muted p-2 text-sm",
                        {
                          "ml-auto": message.senderId === user.uid,
                          "mt-2":
                            i > 0 &&
                            messages[i - 1].senderId !== message.senderId,
                        }
                      )}>
                      <Link
                        to={`profile/${message.senderId}`}
                        className="text-xs text-muted-foreground">
                        {message.senderId !== user.uid &&
                          profile.loaded &&
                          profile.data.name}
                      </Link>
                      <div className="flex justify-between">
                        <p className="break-all text-foreground">
                          {message.content}
                        </p>
                        <span className="mt-auto whitespace-nowrap text-xs text-muted-foreground">
                          {format(message.createdAt, "HH:mm")}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-auto flex w-full px-3 pb-4 pt-1">
                <Input
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full rounded-none border-t border-none border-border py-4"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSendMessage}
                  className="ml-2 aspect-square">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatBoxView;
