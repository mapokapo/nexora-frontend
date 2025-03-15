import { Profile } from "@/lib/context/profile-context";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { User } from "firebase/auth";

interface ProfilePictureProps {
  user: User;
  profile: Profile;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ user, profile }) => {
  return (
    <Avatar className="flex h-full w-full items-center justify-center rounded-full bg-secondary transition-opacity hover:opacity-75">
      <AvatarImage src={user.photoURL ?? undefined} />
      <AvatarFallback className="font-bold text-secondary-foreground">
        {(user.displayName ?? profile.name)
          .split(" ")
          .map(name => name[0])
          .join("")}
      </AvatarFallback>
    </Avatar>
  );
};

export default ProfilePicture;
