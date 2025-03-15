import { Loading } from "@/components/loading";
import ErrorComponent from "@/components/partials/error-component";
import { useProfile } from "@/lib/hooks/use-profile";
import React from "react";
import { Navigate, Outlet } from "react-router";

const NoProfileGuardLayout: React.FC = () => {
  const { profile } = useProfile();

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
