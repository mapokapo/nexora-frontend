import CreatePostForm from "@/components/partials/create-post-form";
import PostsList from "@/components/partials/posts-list";
import React from "react";

const ForYouPage: React.FC = () => {
  return (
    <>
      <CreatePostForm />
      <PostsList forYou={true} />
    </>
  );
};

export default ForYouPage;
