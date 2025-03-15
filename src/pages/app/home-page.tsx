import CreatePostForm from "@/components/partials/create-post-form";
import FriendsList from "@/components/partials/friends-list";
import PostsList from "@/components/partials/posts-list";
import Sidebar from "@/components/partials/sidebar";
import { useAppProfile } from "@/lib/hooks/use-profile";
import React from "react";

const HomePage: React.FC = () => {
  const profile = useAppProfile();

  return (
    <div className="flex h-full min-h-full w-full flex-1 items-stretch justify-center">
      <Sidebar />
      <main className="flex w-full flex-col p-2">
        <CreatePostForm />
        <PostsList />
      </main>
      <FriendsList />
    </div>
  );
};

export default HomePage;
