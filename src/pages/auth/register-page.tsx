import RegisterComponent from "@/components/partials/register";
import { auth } from "@/lib/firebase";
import { mapError } from "@/lib/utils";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { toast } from "sonner";

const RegisterPage: React.FC = () => {
  const [actionError, setActionError] = useState<string | null>(null);

  const onSubmit = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      const message = mapError(error);
      setActionError(message);
      toast.error(message);
    }
  };

  return (
    <div className="m-auto aspect-video w-1/3 min-w-96">
      <RegisterComponent
        onSubmit={values => {
          onSubmit(values);
        }}
        actionError={actionError}
      />
    </div>
  );
};

export default RegisterPage;
