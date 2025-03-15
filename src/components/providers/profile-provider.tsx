import {
  ProfileProviderProps,
  Profile,
  ProfileProviderContext,
  profileSchema,
} from "@/lib/context/profile-context";
import { firestore } from "@/lib/firebase";
import AsyncResult from "@/lib/types/AsyncResult";
import { mapError } from "@/lib/utils";
import { onSnapshot, doc } from "firebase/firestore";
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
          const result = profileSchema.safeParse(snapshot.data());

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

  const value = useMemo(() => ({ profile, setProfile }), [profile, setProfile]);

  return (
    <ProfileProviderContext.Provider value={value}>
      {children}
    </ProfileProviderContext.Provider>
  );
};
