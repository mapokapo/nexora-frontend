import CreatePostForm from "@/components/partials/create-post-form";
import PostsList from "@/components/partials/posts-list";
import React from "react";

const HomePage: React.FC = () => {
  return (
    <>
      <CreatePostForm />
      <PostsList forYou={false} />
    </>
  );
};

export default HomePage;
