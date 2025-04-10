import { Button } from "@/components/ui/button";
import { client } from "@/lib/api/client";
import { firestore } from "@/lib/firebase";
import { useAppUser } from "@/lib/hooks/use-user";
import AsyncValue from "@/lib/types/AsyncValue";
import {
  FriendRequests,
  friendRequestsSchema,
} from "@/lib/types/FriendRequests";
import { onSnapshot, doc } from "firebase/firestore";
import React, { useEffect, useState } from "react";

interface FriendManagementProps {
  userId: string;
}

const FriendManagement: React.FC<FriendManagementProps> = ({ userId }) => {
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

      console.log(result.data);
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

  const isSelf = user.uid === userId;

  const requestSent = friendRequests.loaded
    ? friendRequests.data.sentRequests.includes(userId)
    : false;
  const requestReceived = friendRequests.loaded
    ? friendRequests.data.receivedRequests.includes(userId)
    : false;
  const isFriend = friendRequests.loaded
    ? friendRequests.data.allFriends.includes(userId)
    : false;

  return (
    !isSelf && (
      <div className="flex gap-4">
        {isFriend ? (
          <Button
            variant="destructive"
            size="sm"
            disabled={loading}
            onClick={() => handleRemoveFriend(userId)}>
            Remove Friend
          </Button>
        ) : requestSent ? (
          <Button
            variant="destructive"
            size="sm"
            disabled={loading}
            onClick={() => handleCancelFriendRequest(userId)}>
            Cancel Friend Request
          </Button>
        ) : requestReceived ? (
          <Button
            size="sm"
            disabled={loading}
            onClick={() => handleAcceptFriendRequest(userId)}>
            Accept Friend Request
          </Button>
        ) : (
          <Button
            size="sm"
            disabled={loading}
            onClick={() => handleSendFriendRequest(userId)}>
            Send Friend Request
          </Button>
        )}
      </div>
    )
  );
};

export default FriendManagement;
