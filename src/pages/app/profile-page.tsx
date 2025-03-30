import { Loading } from "@/components/loading";
import FriendsList from "@/components/partials/friends-list";
import PostsList from "@/components/partials/posts-list";
import Sidebar from "@/components/partials/sidebar";
import ProfilePicture from "@/components/profile-picture";
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
          data: profile,
        }
      : {
          loaded: false,
        }
  );

  useEffect(() => {
    if (isOwnPage) {
      return;
    }

    return onSnapshot(
      doc(firestore, "profiles", id),
      snapshot => {
        if (snapshot.exists()) {
          const result = profileSchema.safeParse(snapshot.data());

          if (!result.success) {
            throw new Error("Profile data is corrupted");
          } else {
            setProfilePageData({
              loaded: true,
              data: result.data,
            });
          }
        } else {
          throw new Error("Profile not found");
        }
      },
      error => {
        const message = mapError(error);
        toast.error(message);
      }
    );
  }, [id, isOwnPage]);

  return (
    <div className="flex h-full min-h-full w-full flex-1 items-stretch justify-center">
      <div className="hidden sm:block">
        <Sidebar />
      </div>
      <main className="flex w-full min-w-[400px] flex-col p-2 md:min-w-[500px]">
        {profilePageData.loaded ? (
          <div className="flex flex-col">
            <div className="m-2 rounded-lg bg-card p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12">
                  <ProfilePicture
                    photoURL={isOwnPage ? user.photoURL : null}
                    userName={profilePageData.data.name}
                  />
                </div>
                <h1 className="text-2xl font-bold">
                  {profilePageData.data.name}
                </h1>
              </div>
            </div>
            <PostsList
              forYou={false}
              userId={isOwnPage ? user.uid : id}
            />
          </div>
        ) : (
          <Loading />
        )}
      </main>
      <div className="hidden lg:block">
        <FriendsList />
      </div>
    </div>
  );
};

export default ProfilePage;
