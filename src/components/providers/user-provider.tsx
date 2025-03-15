import {
  UserProviderContext,
  UserProviderProps,
} from "@/lib/context/user-context";
import { auth } from "@/lib/firebase";
import AsyncValue from "@/lib/types/AsyncValue";
import { mapError } from "@/lib/utils";
import { User, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AsyncValue<User | null>>({
    loaded: false,
  });

  useEffect(() => {
    return onAuthStateChanged(
      auth,
      newUser => {
        setUser({
          loaded: true,
          data: newUser,
        });
      },
      error => {
        const message = mapError(error);
        toast.error(message);
      }
    );
  }, []);

  const value = useMemo(() => ({ user, setUser }), [user, setUser]);

  return (
    <UserProviderContext.Provider value={value}>
      {children}
    </UserProviderContext.Provider>
  );
};
