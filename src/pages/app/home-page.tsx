import { useAppProfile } from "@/lib/hooks/use-profile";
import React from "react";

const HomePage: React.FC = () => {
  const profile = useAppProfile();

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Welcome {profile.name}!</h1>
    </div>
  );
};

export default HomePage;
