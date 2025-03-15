import { UserProvider } from "@/components/providers/user-provider";
import { Toaster } from "@/components/ui/sonner";
import { Outlet } from "react-router";

const RootLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <UserProvider>
        <Outlet />
      </UserProvider>
      <Toaster />
    </div>
  );
};

export default RootLayout;
