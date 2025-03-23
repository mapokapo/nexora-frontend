import ProfilePicture from "@/components/profile-picture";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { auth } from "@/lib/firebase";
import { useAppProfile } from "@/lib/hooks/use-profile";
import { useAppUser } from "@/lib/hooks/use-user";
import { signOut } from "firebase/auth";
import { ArrowUpRight, LogOut } from "lucide-react";
import { Link } from "react-router";

const ProfileDropdown: React.FC = () => {
  const user = useAppUser();
  const profile = useAppProfile();

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="rounded-full !bg-transparent"
            variant="ghost"
            size="icon">
            <ProfilePicture
              userName={user.displayName ?? profile.name}
              photoURL={user.photoURL}
            />
            <span className="sr-only">Open profile options</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link
              className="flex cursor-pointer items-center justify-between"
              to="/app/profile">
              <span>Profile</span>
              <ArrowUpRight />
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <AlertDialogTrigger className="flex w-full cursor-pointer items-center justify-between text-red-500">
              <span>Log out</span>
              <LogOut size={24} />
            </AlertDialogTrigger>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
          <AlertDialogDescription className="sr-only">
            You can log back in at any time.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              signOut(auth);
            }}>
            Log out
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ProfileDropdown;
