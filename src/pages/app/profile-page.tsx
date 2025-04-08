import { Loading } from "@/components/loading";
import PostsList from "@/components/partials/posts-list";
import ProfileHeader from "@/components/partials/profile-header";
import { firestore } from "@/lib/firebase";
import { useAppProfile } from "@/lib/hooks/use-profile";
import { useAppUser } from "@/lib/hooks/use-user";
import AsyncValue from "@/lib/types/AsyncValue";
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

  const [profilePageData, setProfilePageData] = useState<AsyncValue<Profile>>(
    isOwnPage
      ? {
          loaded: true,
          data: structuredClone(profile),
        }
      : {
          loaded: false,
        }
  );

  useEffect(() => {
    if (isOwnPage) return;

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
      error => toast.error(mapError(error))
    );
  }, [id, isOwnPage]);

  if (!profilePageData.loaded) {
    return <Loading />;
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
