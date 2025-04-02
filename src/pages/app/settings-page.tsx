import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { firestore } from "@/lib/firebase";
import { useAppProfile } from "@/lib/hooks/use-profile";
import { useAppUser } from "@/lib/hooks/use-user";
import { Profile } from "@/lib/types/Profile";
import { camelCaseToTitleCase, mapError } from "@/lib/utils";
import { updateDoc, doc } from "firebase/firestore";
import React, { useState } from "react";
import { toast } from "sonner";

const SettingsPage: React.FC = () => {
  const user = useAppUser();
  const profile = useAppProfile();
  const [newProfileData, setNewProfileData] = useState(profile);

  const handleUpdateSettings = (key: string, newValue: string) => {
    const updatedSettings = {
      ...newProfileData.settings,
      [key]: newValue,
    };

    setNewProfileData(prev => ({ ...prev, settings: updatedSettings }));

    toast.info("You have changes pending", {
      id: "settings-update",
      action: {
        label: "Save",
        onClick: () => updateProfileData(updatedSettings),
      },
      duration: Infinity,
      closeButton: true,
      onDismiss: revertProfileData,
    });
  };

  const updateProfileData = async (updatedSettings: Profile["settings"]) => {
    try {
      await updateDoc(doc(firestore, "profiles", user.uid), {
        settings: updatedSettings,
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(mapError(error));
    }
  };

  const revertProfileData = () => {
    setNewProfileData(prev => ({
      ...prev,
      settings: profile.settings,
    }));
    toast.dismiss();
  };

  return (
    <div className="m-2 flex flex-col gap-4 rounded-lg bg-card p-6">
      <h2 className="text-lg font-bold">Settings</h2>
      <ul className="flex flex-col gap-4">
        {Object.entries(newProfileData.settings).map(([key, value]) => (
          <li
            key={key}
            className="flex items-center justify-between gap-4">
            <span className="text-sm font-semibold text-muted-foreground">
              {camelCaseToTitleCase(key)}
            </span>
            <Select
              value={value}
              onValueChange={newValue => handleUpdateSettings(key, newValue)}>
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
    </div>
  );
};

export default SettingsPage;
