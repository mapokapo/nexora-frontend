import { auth } from "@/lib/firebase";
import AsyncValue from "@/lib/types/AsyncValue";
import { mapError } from "@/lib/utils";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";

type UserProviderProps = PropsWithChildren;

interface UserProviderState {
  user: AsyncValue<User | null>;
  setUser: (user: AsyncValue<User | null>) => void;
}

const initialState: UserProviderState = {
  user: {
    loaded: false,
  },
  setUser: () => {},
};

const UserProviderContext = createContext<UserProviderState>(initialState);

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

export function useUser() {
  const context = useContext(UserProviderContext) as
    | UserProviderState
    | undefined;

  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}

export function useAppUser() {
  const { user } = useUser();

  if (!user.loaded) {
    throw new Error(
      "useAppUser must be used within a UserProvider that has loaded the auth state"
    );
  }

  if (user.data === null) {
    throw new Error(
      "useAppUser must be used within a UserProvider that has a signed-in user"
    );
  }

  return user.data;
}
