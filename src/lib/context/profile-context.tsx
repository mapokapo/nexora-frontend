import AsyncResult from "@/lib/types/AsyncResult";
import { User } from "firebase/auth";
import { createContext, PropsWithChildren } from "react";
import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export type Profile = z.infer<typeof profileSchema>;

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
