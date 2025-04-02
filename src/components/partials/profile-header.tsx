import ProfilePicture from "@/components/profile-picture";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Profile } from "@/lib/types/Profile";
import { camelCaseToTitleCase } from "@/lib/utils";

interface ProfileHeaderProps {
  profile: Profile;
  isOwnPage: boolean;
  onUpdateSettings: (key: string, newValue: string) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  isOwnPage,
  onUpdateSettings,
}) => {
  return (
    <div className="m-2 flex flex-col gap-4 rounded-lg bg-card p-6">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12">
          <ProfilePicture profile={profile} />
        </div>
        <h1 className="text-2xl font-bold">{profile.name}</h1>
      </div>
      {isOwnPage && (
        <>
          <Separator />
          <h2 className="text-lg font-bold">Settings</h2>
          <ul className="flex flex-col gap-4">
            {Object.entries(profile.settings).map(([key, value]) => (
              <li
                key={key}
                className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-muted-foreground">
                  {camelCaseToTitleCase(key)}
                </span>
                <Select
                  value={value}
                  onValueChange={newValue => onUpdateSettings(key, newValue)}>
                  <SelectTrigger className="h-min w-40 p-2">
                    <SelectValue placeholder="Setting" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="everyone">Everyone</SelectItem>
                    {key === "allowFriendRequestsFrom" ? (
                      <SelectItem value="mutuals">Mutuals</SelectItem>
                    ) : (
                      <SelectItem value="friends">Friends</SelectItem>
                    )}
                    <SelectItem value="nobody">Nobody</SelectItem>
                  </SelectContent>
                </Select>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default ProfileHeader;
