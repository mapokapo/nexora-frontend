import {
  UserProviderContext,
  UserProviderState,
} from "@/lib/context/user-context";
import { useContext } from "react";

export function useUser() {
  const context = useContext(UserProviderContext) as
    | UserProviderState
    | undefined;

  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}

export function useAppUser() {
  const { user } = useUser();

  if (!user.loaded) {
    throw new Error(
      "useAppUser must be used within a UserProvider that has loaded the auth state"
    );
  }

  if (user.data === null) {
    throw new Error(
      "useAppUser must be used within a UserProvider that has a signed-in user"
    );
  }

  return user.data;
}
