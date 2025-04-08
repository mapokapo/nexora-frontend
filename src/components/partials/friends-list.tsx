import ProfilePicture from "@/components/profile-picture";
import { Button } from "@/components/ui/button";
import { firestore } from "@/lib/firebase";
import { useChatBox } from "@/lib/hooks/use-chat-box";
import { useAppUser } from "@/lib/hooks/use-user";
import AsyncValue from "@/lib/types/AsyncValue";
import {
  FriendRequests,
  friendRequestsSchema,
} from "@/lib/types/FriendRequests";
import { Profile, profileSchema } from "@/lib/types/Profile";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";

const FriendsList: React.FC = () => {
  const user = useAppUser();
  const { setIsChatBoxOpened, setCurrentlyChattingUserId } = useChatBox();
  const [friendRequests, setFriendRequests] = useState<
    AsyncValue<FriendRequests>
  >({ loaded: false });
  const [friendProfiles, setFriendProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    return onSnapshot(doc(firestore, "friendRequests", user.uid), snapshot => {
      const result = friendRequestsSchema.safeParse({
        userId: snapshot.id,
        ...snapshot.data(),
      });

      if (!result.success) {
        console.error(result.error.errors);
        return;
      }

      setFriendRequests({
        loaded: true,
        data: result.data,
      });
    });
  }, [user.uid]);

  useEffect(() => {
    if (!friendRequests.loaded) {
      return;
    }

    const confirmedFriendIds = friendRequests.data.allFriends;

    const unsubscribeFns: (() => void)[] = [];
    for (const friendId of confirmedFriendIds) {
      const unsubscribe = onSnapshot(
        doc(firestore, "profiles", friendId),
        snapshot => {
          const result = profileSchema.safeParse({
            id: snapshot.id,
            ...snapshot.data(),
          });

          if (!result.success) {
            console.error(result.error.errors);
            return;
          }

          const profile = result.data;

          if (profile.id === user.uid) {
            return;
          }

          setFriendProfiles(prev => {
            const existingProfile = prev.find(p => p.id === profile.id);
            if (existingProfile) {
              return prev.map(p => (p.id === profile.id ? profile : p));
            } else {
              return [...prev, profile];
            }
          });
        }
      );

      unsubscribeFns.push(unsubscribe);
    }

    return () => {
      unsubscribeFns.forEach(unsubscribe => {
        unsubscribe();
      });
    };
  }, [friendRequests, user.uid]);

  const handleFriendClicked = (friendId: string) => {
    setCurrentlyChattingUserId(friendId);
    setIsChatBoxOpened(true);
  };

  return (
    <aside className="sticky top-0 max-h-[75vh] min-w-56 justify-start space-y-4 overflow-y-auto border-l border-border bg-card p-4 xl:min-w-64">
      <span className="ml-2 text-lg font-semibold">Friends</span>
      <div className="flex flex-col gap-2">
        {friendProfiles.map(friendProfile => (
          <Button
            key={friendProfile.id}
            className="flex w-full cursor-pointer items-center justify-start gap-2 rounded-lg px-2 py-2 text-lg hover:bg-muted"
            onClick={() => {
              handleFriendClicked(friendProfile.id);
            }}
            variant="ghost">
            <div className="h-6 w-6">
              <ProfilePicture profile={friendProfile} />
            </div>
            <span>{friendProfile.name}</span>
          </Button>
        ))}
      </div>
    </aside>
  );
};

export default FriendsList;
