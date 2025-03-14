import CreateProfileComponent from "@/components/create-profile";
import { useAppUser } from "@/lib/context/user-provider";
import { firestore } from "@/lib/firebase";
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
      });
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
