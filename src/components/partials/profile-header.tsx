import ProfilePicture from "@/components/profile-picture";
import { Button } from "@/components/ui/button";
import { client } from "@/lib/api/client";
import { firestore } from "@/lib/firebase";
import { useAppUser } from "@/lib/hooks/use-user";
import AsyncValue from "@/lib/types/AsyncValue";
import {
  FriendRequests,
  friendRequestsSchema,
} from "@/lib/types/FriendRequests";
import { Profile } from "@/lib/types/Profile";
import { onSnapshot, doc } from "firebase/firestore";
import { useState, useEffect } from "react";

interface ProfileHeaderProps {
  profile: Profile;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  const user = useAppUser();
  const [loading, setLoading] = useState(false);
  const [friendRequests, setFriendRequests] = useState<
    AsyncValue<FriendRequests>
  >({ loaded: false });

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

  const handleSendFriendRequest = async (userId: string) => {
    setLoading(true);
    await client.friends.add.$post({
      json: {
        userId,
      },
    });
    setLoading(false);
  };

  const handleCancelFriendRequest = async (userId: string) => {
    setLoading(true);
    await client.friends.cancel.$delete({
      json: {
        userId,
      },
    });
    setLoading(false);
  };

  const handleAcceptFriendRequest = async (userId: string) => {
    setLoading(true);
    await client.friends.accept.$post({
      json: {
        userId,
      },
    });
    setLoading(false);
  };

  const handleRemoveFriend = async (userId: string) => {
    setLoading(true);
    await client.friends.remove.$delete({
      json: {
        userId,
      },
    });
    setLoading(false);
  };

  const requestSent = friendRequests.loaded
    ? friendRequests.data.sentRequests.includes(profile.id)
    : false;

  const requestReceived = friendRequests.loaded
    ? friendRequests.data.receivedRequests.includes(profile.id)
    : false;

  const isFriend = friendRequests.loaded
    ? friendRequests.data.allFriends.includes(profile.id)
    : false;

  return (
    <div className="m-2 flex flex-col gap-4 rounded-lg bg-card p-6">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12">
          <ProfilePicture profile={profile} />
        </div>
        <h1 className="text-2xl font-bold">{profile.name}</h1>
      </div>
      <div className="flex gap-4">
        {isFriend ? (
          <Button
            variant="destructive"
            size="sm"
            disabled={loading}
            onClick={() => handleRemoveFriend(profile.id)}>
            Remove Friend
          </Button>
        ) : requestSent ? (
          <Button
            variant="destructive"
            size="sm"
            disabled={loading}
            onClick={() => handleCancelFriendRequest(profile.id)}>
            Cancel Friend Request
          </Button>
        ) : requestReceived ? (
          <Button
            size="sm"
            disabled={loading}
            onClick={() => handleAcceptFriendRequest(profile.id)}>
            Accept Friend Request
          </Button>
        ) : (
          <Button
            size="sm"
            disabled={loading}
            onClick={() => handleSendFriendRequest(profile.id)}>
            Send Friend Request
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
