import CreatePostForm from "@/components/partials/create-post-form";
import FriendsList from "@/components/partials/friends-list";
import PostsList from "@/components/partials/posts-list";
import Sidebar from "@/components/partials/sidebar";
import React from "react";

const HomePage: React.FC = () => {
  return (
    <div className="flex h-full min-h-full w-full flex-1 items-stretch justify-center">
      <div className="hidden sm:block">
        <Sidebar />
      </div>
      <main className="flex w-full min-w-[400px] flex-col p-2 md:min-w-[500px]">
        <CreatePostForm />
        <PostsList />
      </main>
      <div className="hidden lg:block">
        <FriendsList />
      </div>
    </div>
  );
};

export default HomePage;
