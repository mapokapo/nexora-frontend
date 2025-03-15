import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
          className="rounded-full"
          variant="link"
          size="icon">
          <Avatar>
            <AvatarImage src={user.photoURL ?? undefined} />
            <AvatarFallback className="bg-secondary font-bold text-secondary-foreground">
              {(user.displayName ?? profile.name)
                .split(" ")
                .map(name => name[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
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
