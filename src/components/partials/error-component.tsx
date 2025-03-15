import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { X, LogOut, RefreshCcw } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router";

export interface ErrorComponentProps {
  title: string;
  message: string;
  action: "log-out" | "refresh" | "go-back";
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({
  title,
  message,
  action,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center">
      <X
        size={48}
        className="rounded-full bg-destructive p-1 text-destructive-foreground"
      />
      <p className="mt-4 text-lg font-bold text-muted-foreground">{title}</p>
      <p className="text-muted-foreground">{message}</p>
      {action === "log-out" && (
        <Button
          variant="default"
          className="mt-6 flex gap-2"
          onClick={() => {
            signOut(auth);
          }}>
          <LogOut size={24} />
          <span>Log out</span>
        </Button>
      )}
      {action === "refresh" && (
        <Button
          variant="default"
          className="mt-6 flex gap-2"
          onClick={() => {
            navigate(0);
          }}>
          <RefreshCcw size={24} />
          <span>Refresh</span>
        </Button>
      )}
      {action === "go-back" && (
        <Button
          variant="default"
          className="mt-6 flex gap-2"
          onClick={() => {
            navigate(-1);
          }}>
          <RefreshCcw size={24} />
          <span>Go back</span>
        </Button>
      )}
    </div>
  );
};

export default ErrorComponent;
