import { Loading } from "@/components/loading";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { useProfile } from "@/lib/hooks/use-profile";
import { signOut } from "firebase/auth";
import { LogOut, X } from "lucide-react";
import React from "react";
import { Navigate, Outlet } from "react-router";

const NoProfileGuardLayout: React.FC = () => {
  const { profile } = useProfile();

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

    if (profile.data !== null) {
      return (
        <Navigate
          to="/"
          replace
        />
      );
    }

    return (
      <div className="flex min-h-screen w-full flex-col">
        <Outlet />
      </div>
    );
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
};

export default NoProfileGuardLayout;
