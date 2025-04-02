import { Loading } from "@/components/loading";
import FriendsList from "@/components/partials/friends-list";
import PostsList from "@/components/partials/posts-list";
import ProfileHeader from "@/components/partials/profile-header";
import Sidebar from "@/components/partials/sidebar";
import { firestore } from "@/lib/firebase";
import { useAppProfile } from "@/lib/hooks/use-profile";
import { useAppUser } from "@/lib/hooks/use-user";
import AsyncValue from "@/lib/types/AsyncValue";
import { Profile, profileSchema } from "@/lib/types/Profile";
import { mapError } from "@/lib/utils";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
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
          const result = profileSchema.safeParse(snapshot.data());

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

  const handleUpdateSettings = (key: string, newValue: string) => {
    if (!profilePageData.loaded) return;

    const updatedSettings = {
      ...profilePageData.data.settings,
      [key]: newValue,
    };

    setProfilePageData(prev =>
      prev.loaded
        ? { ...prev, data: { ...prev.data, settings: updatedSettings } }
        : prev
    );

    toast.info("You have changes pending", {
      action: {
        label: "Save",
        onClick: () => updateProfileData(updatedSettings),
      },
      duration: Infinity,
      closeButton: true,
      onDismiss: revertProfileData,
    });
  };

  const updateProfileData = async (updatedSettings: Profile["settings"]) => {
    try {
      await updateDoc(doc(firestore, "profiles", user.uid), {
        settings: updatedSettings,
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(mapError(error));
    }
  };

  const revertProfileData = () => {
    if (!profilePageData.loaded) {
      return;
    }

    setProfilePageData({
      loaded: true,
      data: structuredClone(profile),
    });
    toast.dismiss();
  };

  return (
    <div className="flex h-full min-h-full w-full flex-1 items-stretch justify-center">
      <div className="hidden sm:block">
        <Sidebar />
      </div>
      <main className="flex w-full min-w-[400px] flex-col p-2 md:min-w-[500px]">
        {profilePageData.loaded ? (
          <div className="flex flex-col">
            <ProfileHeader
              profile={profilePageData.data}
              isOwnPage={isOwnPage}
              onUpdateSettings={handleUpdateSettings}
            />
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
