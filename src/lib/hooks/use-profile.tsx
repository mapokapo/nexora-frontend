import {
  ProfileProviderContext,
  Profile,
  ProfileProviderState,
} from "@/lib/context/profile-context";
import { useContext } from "react";

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
