import { firestore } from "@/lib/firebase";
import AsyncResult from "@/lib/types/AsyncResult";
import { User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";

import { mapError } from "../utils";

export type Profile = Record<string, unknown>;

type ProfileProviderProps = PropsWithChildren & {
  user: User | null;
};

interface ProfileProviderState {
  profile: AsyncResult<Profile | null, Error>;
  setProfile: (profile: AsyncResult<Profile | null, Error>) => void;
}

const initialState: ProfileProviderState = {
  profile: {
    loaded: false,
  },
  setProfile: () => {},
};

const ProfileProviderContext =
  createContext<ProfileProviderState>(initialState);

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
          setProfile({
            loaded: true,
            data: snapshot.data(),
          });
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

export function useProfile() {
  const context = useContext(ProfileProviderContext) as
    | ProfileProviderState
    | undefined;

  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }

  return context;
}

export function useAppProfile(): Profile {
  const { profile } = useProfile();

  if (!profile.loaded) {
    throw new Error(
      "useAppProfile must be used within a ProfileProvider that has loaded profile data"
    );
  }

  if ("error" in profile) {
    throw profile.error;
  }

  if (profile.data === null) {
    throw new Error(
      "useAppProfile must be used within a ProfileProvider that has non-null profile data"
    );
  }

  return profile.data;
}
