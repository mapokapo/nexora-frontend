import { Loading } from "@/components/loading";
import Navbar from "@/components/navbar";
import ErrorComponent from "@/components/partials/error-component";
import { useProfile } from "@/lib/hooks/use-profile";
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router";

const ProfileGuardLayout: React.FC = () => {
  const { profile } = useProfile();
  const location = useLocation();

  if (profile.loaded) {
    if ("error" in profile) {
      return (
        <ErrorComponent
          title="An error occurred while fetching your profile."
          message="If the problem persists, try clearing site data or logging out."
          action="log-out"
        />
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
      <Navbar />
      <div className="flex h-full w-full flex-col">
        <Outlet />
      </div>
    </div>
  );
};

export default ProfileGuardLayout;
