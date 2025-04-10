import { Button } from "@/components/ui/button";
import { client } from "@/lib/api/client";
import { firestore } from "@/lib/firebase";
import { useAppUser } from "@/lib/hooks/use-user";
import AsyncValue from "@/lib/types/AsyncValue";
import {
  FriendRequests,
  friendRequestsSchema,
} from "@/lib/types/FriendRequests";
import { mapError } from "@/lib/utils";
import { onSnapshot, doc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

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
    await client.friends.add.$post({
      json: {
        userId,
      },
    });
    toast.success("Friend request sent");
  };

  const handleCancelFriendRequest = async (userId: string) => {
    await client.friends.cancel.$delete({
      json: {
        userId,
      },
    });
    toast.success("Friend request cancelled");
  };

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

  const handleRemoveFriend = async (userId: string) => {
    await client.friends.remove.$delete({
      json: {
        userId,
      },
    });
    toast.success("Friend removed successfully");
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
            onClick={() => handleErrors(handleRemoveFriend(userId))}>
            Remove Friend
          </Button>
        ) : requestSent ? (
          <Button
            variant="destructive"
            size="sm"
            disabled={loading}
            onClick={() => handleErrors(handleCancelFriendRequest(userId))}>
            Cancel Friend Request
          </Button>
        ) : requestReceived ? (
          <>
            <Button
              size="sm"
              disabled={loading}
              onClick={() => handleErrors(handleAcceptFriendRequest(userId))}>
              Accept Friend Request
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={loading}
              onClick={() => handleErrors(handleDeclineFriendRequest(userId))}>
              Decline Friend Request
            </Button>
          </>
        ) : (
          <Button
            size="sm"
            disabled={loading}
            onClick={() => handleErrors(handleSendFriendRequest(userId))}>
            Send Friend Request
          </Button>
        )}
      </div>
    )
  );
};

export default FriendManagement;
