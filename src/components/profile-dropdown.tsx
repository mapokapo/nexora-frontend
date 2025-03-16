import ProfilePicture from "@/components/profile-picture";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useAppProfile } from "@/lib/hooks/use-profile";
import { useAppUser } from "@/lib/hooks/use-user";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";

const ProfileDropdown: React.FC = () => {
  const user = useAppUser();
  const profile = useAppProfile();

  return (
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
