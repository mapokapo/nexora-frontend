import { ThemeProvider } from "@/components/providers/theme-provider";
import { UserProvider } from "@/components/providers/user-provider";
import { Toaster } from "@/components/ui/sonner";
import { Outlet } from "react-router";

const RootLayout: React.FC = () => {
  return (
    <ThemeProvider
      defaultTheme="system"
      storageKey="vite-ui-theme">
      <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
        <UserProvider>
          <Outlet />
        </UserProvider>
        <Toaster />
      </div>
    </ThemeProvider>
  );
};

export default RootLayout;
