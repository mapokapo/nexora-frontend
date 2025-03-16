import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

interface ProfilePictureProps {
  photoURL: string | null;
  userName: string;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({
  photoURL,
  userName,
}) => {
  return (
    <Avatar className="flex aspect-square h-full w-full items-center justify-center rounded-full bg-secondary transition-opacity hover:opacity-75">
      <AvatarImage src={photoURL ?? undefined} />
      <AvatarFallback className="font-bold text-secondary-foreground">
        {userName
          .split(" ")
          .map(name => name[0])
          .join("")}
      </AvatarFallback>
    </Avatar>
  );
};

export default ProfilePicture;
