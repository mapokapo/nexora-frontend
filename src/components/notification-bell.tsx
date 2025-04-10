import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { client } from "@/lib/api/client";
import { firestore } from "@/lib/firebase";
import { useAppUser } from "@/lib/hooks/use-user";
import AsyncValue from "@/lib/types/AsyncValue";
import {
  FriendRequests,
  friendRequestsSchema,
} from "@/lib/types/FriendRequests";
import { Profile, profileSchema } from "@/lib/types/Profile";
import { mapError } from "@/lib/utils";
import { onSnapshot, doc } from "firebase/firestore";
import { Bell, Check, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const NotificationBell: React.FC = () => {
  const user = useAppUser();

  const [friendRequests, setFriendRequests] = useState<
    AsyncValue<FriendRequests>
  >({ loaded: false });
  const [friendProfiles, setFriendProfiles] = useState<AsyncValue<Profile[]>>({
    loaded: false,
  });
  const [loading, setLoading] = useState(false);

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

      console.log(result.data);
    });
  }, [user.uid]);

  useEffect(() => {
    if (!friendRequests.loaded) return;

    if (friendRequests.data.receivedRequests.length === 0) {
      setFriendProfiles({ loaded: true, data: [] });
      return;
    }

    const unsubscribeFns: (() => void)[] = [];

    for (const friendId of friendRequests.data.receivedRequests) {
      const unsubscribe = onSnapshot(
        doc(firestore, "profiles", friendId),
        snapshot => {
          const result = profileSchema.safeParse({
            id: snapshot.id,
            ...snapshot.data(),
          });

          if (!result.success) {
            throw new Error("Profile data is corrupted");
          }

          setFriendProfiles(prev => {
            if (prev.loaded) {
              return {
                ...prev,
                data: [...prev.data, result.data],
              };
            }

            return {
              loaded: true,
              data: [result.data],
            };
          });
        },
        error => {
          console.error("Error fetching friend profile:", error);
        }
      );

      unsubscribeFns.push(unsubscribe);
    }

    return () => {
      unsubscribeFns.forEach(unsubscribe => unsubscribe());
    };
  }, [friendRequests]);

  const handleAcceptFriendRequest = async (userId: string) => {
    await client.friends.accept.$post({
      json: {
        userId,
      },
    });
    toast.success("Friend request accepted");
  };

  const handleDeclineFriendRequest = async (userId: string) => {
    await client.friends.decline.$post({
      json: {
        userId,
      },
    });
    toast.success("Friend request declined");
  };

  const handleErrors = async (promise: Promise<void>) => {
    setLoading(true);
    try {
      await promise;
    } catch (error) {
      toast.error(mapError(error));
    }
    setLoading(false);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative">
          <Button
            variant="outline"
            size="icon">
            <Bell className="h-[1.2rem] w-[1.2rem] text-white" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          {friendProfiles.loaded && friendProfiles.data.length > 0 && (
            <div className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500" />
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent>
        {friendProfiles.loaded ? (
          friendProfiles.data.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {friendProfiles.data.map(profile => (
                <li
                  key={profile.id}
                  className="flex items-center justify-between">
                  <div>
                    <p>{profile.name}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={loading}
                      onClick={() =>
                        handleErrors(handleAcceptFriendRequest(profile.id))
                      }>
                      <Check />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      disabled={loading}
                      onClick={() =>
                        handleErrors(handleDeclineFriendRequest(profile.id))
                      }>
                      <X />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center">
              <p>No new notifications</p>
            </div>
          )
        ) : (
          <div className="text-center">
            <p>Loading notifications...</p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
