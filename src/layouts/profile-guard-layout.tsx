import { Loading } from "@/components/loading";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/lib/context/profile-provider";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { LogOut, X } from "lucide-react";
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router";

const ProfileGuardLayout: React.FC = () => {
  const { profile } = useProfile();
  const location = useLocation();

  if (profile.loaded) {
    if ("error" in profile) {
      return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center">
          <X
            size={48}
            className="rounded-full bg-primary p-1 text-red-500"
          />
          <p className="mt-4 text-muted-foreground">
            An error occurred while fetching your profile.
          </p>
          <p className="text-muted-foreground">
            If the problem persists, try clearing site data or logging out.
          </p>
          <Button
            variant="destructive"
            className="mt-6 flex gap-2"
            onClick={() => {
              signOut(auth);
            }}>
            <LogOut size={24} />
            <span>Log out</span>
          </Button>
        </div>
      );
    }

    if (profile.data === null && location.pathname !== "/create-profile") {
      return (
        <Navigate
          to="/create-profile"
          replace
        />
      );
    } else if (
      profile.data !== null &&
      location.pathname === "/create-profile"
    ) {
      return (
        <Navigate
          to="/"
          replace
        />
      );
    }
  } else {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <Loading />
        <span className="mt-4 text-muted-foreground">
          Fetching user profile...
        </span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Outlet />
    </div>
  );
};

export default ProfileGuardLayout;
