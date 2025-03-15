import { Loading } from "@/components/loading";
import { useProfile } from "@/lib/hooks/use-profile";
import { useUser } from "@/lib/hooks/use-user";
import { Navigate, Outlet } from "react-router";

const AuthLayout: React.FC = () => {
  const { user } = useUser();
  const { profile } = useProfile();

  if (!user.loaded) {
    return (
      <div className="flex w-full flex-1 flex-col items-center justify-center">
        <Loading />
        <span className="mt-4 text-muted-foreground">
          Reading authentication state...
        </span>
      </div>
    );
  }

  if (user.data !== null) {
    if (profile.loaded && "data" in profile && profile.data !== null) {
      return (
        <Navigate
          to="/create-profile"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/app"
        replace
      />
    );
  }

  return <Outlet />;
};

export default AuthLayout;
