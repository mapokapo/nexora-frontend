import AsyncValue from "@/lib/types/AsyncValue";
import { User } from "firebase/auth";
import { createContext, PropsWithChildren } from "react";

export type UserProviderProps = PropsWithChildren;

export interface UserProviderState {
  user: AsyncValue<User | null>;
  setUser: (user: AsyncValue<User | null>) => void;
}

export const initialState: UserProviderState = {
  user: {
    loaded: false,
  },
  setUser: () => {},
};

export const UserProviderContext =
  createContext<UserProviderState>(initialState);
