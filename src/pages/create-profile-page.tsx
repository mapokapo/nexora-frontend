import CreateProfileComponent from "@/components/partials/create-profile";
import { firestore } from "@/lib/firebase";
import { useAppUser } from "@/lib/hooks/use-user";
import { Profile } from "@/lib/types/Profile";
import { mapError } from "@/lib/utils";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { toast } from "sonner";

const CreateProfilePage: React.FC = () => {
  const [actionError, setActionError] = useState<string | null>(null);
  const user = useAppUser();

  const onSubmit = async ({ name }: { name: string }) => {
    try {
      await setDoc(doc(firestore, "profiles", user.uid), {
        name,
        settings: {
          allowCommentsFrom: "everyone",
          allowMessagesFrom: "everyone",
          allowFriendRequestsFrom: "everyone",
          allowProfileVisitsFrom: "everyone",
        },
      } satisfies Profile);
    } catch (error) {
      const message = mapError(error);
      setActionError(message);
      toast.error(message);
    }
  };

  return (
    <div className="m-auto aspect-video w-1/3 min-w-96">
      <CreateProfileComponent
        onSubmit={values => {
          onSubmit(values);
        }}
        actionError={actionError}
      />
    </div>
  );
};

export default CreateProfilePage;
