import AsyncResult from "@/lib/types/AsyncResult";
import { Profile } from "@/lib/types/Profile";
import { User } from "firebase/auth";
import { createContext, PropsWithChildren } from "react";

export type ProfileProviderProps = PropsWithChildren & {
  user: User | null;
};

export interface ProfileProviderState {
  profile: AsyncResult<Profile | null, Error>;
  setProfile: (profile: AsyncResult<Profile | null, Error>) => void;
}

export const initialState: ProfileProviderState = {
  profile: {
    loaded: false,
  },
  setProfile: () => {},
};

export const ProfileProviderContext =
  createContext<ProfileProviderState>(initialState);
