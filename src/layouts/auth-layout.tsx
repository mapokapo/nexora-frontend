import { useProfile } from "@/lib/context/profile-provider";
import { useUser } from "@/lib/context/user-provider";
import { Navigate, Outlet, useLocation } from "react-router";

const AuthLayout: React.FC = () => {
  const { user } = useUser();
  const { profile } = useProfile();
  const location = useLocation();

  if (
    user.loaded &&
    user.data !== null &&
    profile.loaded &&
    "data" in profile &&
    profile.data !== null
  ) {
    const previousLocation = (location.state as Record<string, unknown>).from;

    return <Navigate to={previousLocation ?? "/app/home"} />;
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
