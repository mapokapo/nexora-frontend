import {
  ProfileProviderProps,
  ProfileProviderContext,
} from "@/lib/context/profile-context";
import { firestore } from "@/lib/firebase";
import AsyncResult from "@/lib/types/AsyncResult";
import { Profile, profileSchema } from "@/lib/types/Profile";
import { mapError } from "@/lib/utils";
import { onSnapshot, doc, updateDoc } from "firebase/firestore";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";

export const ProfileProvider: React.FC<ProfileProviderProps> = ({
  children,
  user,
}) => {
  const [profile, setProfile] = useState<AsyncResult<Profile | null, Error>>({
    loaded: false,
  });

  useEffect(() => {
    if (user === null) {
      setProfile({
        loaded: true,
        data: null,
      });
      return;
    }

    return onSnapshot(
      doc(firestore, "profiles", user.uid),
      snapshot => {
        if (snapshot.exists()) {
          const result = profileSchema.safeParse({
            id: snapshot.id,
            ...snapshot.data(),
          });

          if (!result.success) {
            const message = "Profile data is corrupted";
            toast.error(message);

            setProfile({
              loaded: true,
              error: new Error(message),
            });
          } else {
            setProfile({
              loaded: true,
              data: result.data,
            });
          }
        } else {
          setProfile({
            loaded: true,
            data: null,
          });
        }
      },
      error => {
        const message = mapError(error);
        toast.error(message);

        setProfile({
          loaded: true,
          error,
        });
      }
    );
  }, [user]);

  useEffect(() => {
    if (
      user &&
      user.photoURL !== null &&
      profile.loaded &&
      "data" in profile &&
      profile.data !== null &&
      profile.data.photoURL === undefined
    ) {
      updateDoc(doc(firestore, "profiles", user.uid), {
        photoURL: user.photoURL,
      });
    }
  }, [user, profile]);

  const value = useMemo(() => ({ profile, setProfile }), [profile, setProfile]);

  return (
    <ProfileProviderContext.Provider value={value}>
      {children}
    </ProfileProviderContext.Provider>
  );
};
