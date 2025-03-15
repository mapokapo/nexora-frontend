import { Loading } from "@/components/loading";
import { ProfileProvider } from "@/components/providers/profile-provider";
import { useUser } from "@/lib/hooks/use-user";
import { Navigate, Outlet } from "react-router";

const UserGuardLayout: React.FC = () => {
  const { user } = useUser();

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
    return (
      <ProfileProvider user={user.data}>
        <Outlet />
      </ProfileProvider>
    );
  } else {
    return (
      <Navigate
        to="/auth/login"
        replace
      />
    );
  }
};

export default UserGuardLayout;
