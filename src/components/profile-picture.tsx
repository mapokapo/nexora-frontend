import { Profile } from "@/lib/types/Profile";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

interface ProfilePictureProps {
  profile: Profile;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ profile }) => {
  return (
    <Avatar className="flex aspect-square h-full w-full items-center justify-center rounded-full bg-secondary transition-opacity hover:opacity-75">
      <AvatarImage src={profile.photoURL} />
      <AvatarFallback className="font-bold text-secondary-foreground">
        {profile.name
          .split(" ")
          .map(name => name[0])
          .join("")}
      </AvatarFallback>
    </Avatar>
  );
};

export default ProfilePicture;
