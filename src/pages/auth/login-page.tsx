import LoginComponent from "@/components/partials/login";
import { auth } from "@/lib/firebase";
import { mapError } from "@/lib/utils";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useState } from "react";
import { toast } from "sonner";

const LoginPage: React.FC = () => {
  const [actionError, setActionError] = useState<string | null>(null);

  const onSubmit = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      const message = mapError(error);
      setActionError(message);
      toast.error(message);
    }
  };

  const onSignInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (error) {
      const message = mapError(error);
      setActionError(message);
      toast.error(message);
    }
  };

  return (
    <div className="m-auto aspect-video w-1/3 min-w-96">
      <LoginComponent
        onSubmit={values => {
          onSubmit(values.email, values.password);
        }}
        onSignInWithGoogle={() => {
          onSignInWithGoogle();
        }}
        actionError={actionError}
      />
    </div>
  );
};

export default LoginPage;
