import FriendManagement from "@/components/friend-management";
import ProfilePicture from "@/components/profile-picture";
import { Profile } from "@/lib/types/Profile";

interface ProfileHeaderProps {
  profile: Profile;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  return (
    <div className="m-2 flex flex-col gap-4 rounded-lg bg-card p-6">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12">
          <ProfilePicture profile={profile} />
        </div>
        <h1 className="text-2xl font-bold">{profile.name}</h1>
      </div>
      <FriendManagement userId={profile.id} />
    </div>
  );
};

export default ProfileHeader;
