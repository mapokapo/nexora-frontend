import FriendManagement from "@/components/friend-management";
import { Loading } from "@/components/loading";
import PostsList from "@/components/partials/posts-list";
import ProfileHeader from "@/components/partials/profile-header";
import { firestore } from "@/lib/firebase";
import { useAppProfile } from "@/lib/hooks/use-profile";
import { useAppUser } from "@/lib/hooks/use-user";
import AsyncResult from "@/lib/types/AsyncResult";
import { Profile, profileSchema } from "@/lib/types/Profile";
import { mapError } from "@/lib/utils";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";

const ProfilePage: React.FC = () => {
  const { id } = useParams();
  const user = useAppUser();
  const profile = useAppProfile();
  const isOwnPage = id === user.uid || id === undefined;

  const [profilePageData, setProfilePageData] = useState<
    AsyncResult<Profile, Error>
  >({
    loaded: false,
  });

  useEffect(() => {
    if (isOwnPage) {
      setProfilePageData({
        loaded: true,
        data: structuredClone(profile),
      });
      return;
    }

    return onSnapshot(
      doc(firestore, "profiles", id),
      snapshot => {
        if (snapshot.exists()) {
          const result = profileSchema.safeParse({
            id: snapshot.id,
            ...snapshot.data(),
          });

          if (!result.success) {
            throw new Error("Profile data is corrupted");
          }

          setProfilePageData({
            loaded: true,
            data: result.data,
          });
        } else {
          throw new Error("Profile not found");
        }
      },
      error => {
        toast.error(mapError(error));

        if (error.code === "permission-denied") {
          setProfilePageData({
            loaded: true,
            error: new Error("This profile is private", {
              cause: error,
            }),
          });
        }
      }
    );
  }, [id, isOwnPage, profile]);

  if (!profilePageData.loaded) {
    return <Loading />;
  }

  if ("error" in profilePageData) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">{profilePageData.error.message}</h1>
        {id !== undefined &&
          profilePageData.error.cause instanceof Error &&
          "code" in profilePageData.error.cause &&
          profilePageData.error.cause.code === "permission-denied" && (
            <FriendManagement userId={id} />
          )}
      </div>
    );
  }

  return (
    <>
      <ProfileHeader profile={profilePageData.data} />
      <h2 className="m-2 mt-4 text-lg font-bold">
        {profilePageData.data.name}'s Posts
      </h2>
      <PostsList
        forYou={false}
        userId={isOwnPage ? user.uid : id}
      />
    </>
  );
};

export default ProfilePage;
