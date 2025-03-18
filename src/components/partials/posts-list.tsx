import { Loading } from "@/components/loading";
import PostListItem from "@/components/post-list-item";
import { client } from "@/lib/api/client";
import { firestore } from "@/lib/firebase";
import AsyncValue from "@/lib/types/AsyncValue";
import { Post, postSchema } from "@/lib/types/Post";
import { mapError } from "@/lib/utils";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

interface PostsListProps {
  forYou: boolean;
}

const PostsList: React.FC<PostsListProps> = ({ forYou }) => {
  const [posts, setPosts] = useState<AsyncValue<Post[]>>({ loaded: false });

  useEffect(() => {
    const fetchAllPosts = async () => {
      const posts = await getDocs(collection(firestore, "posts"));

      const result = z
        .array(postSchema)
        .safeParse(posts.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      if (!result.success) {
        console.error(result.error.errors);
        return [];
      }

      return result.data;
    };

    const fetchForYouPosts = async () => {
      const res = await client["for-you"].$get();
      const data: Post = await res.json();

      const result = z.array(postSchema).safeParse(data);

      if (!result.success) {
        console.error(result.error.errors);
        return [];
      }

      return result.data;
    };

    const fetchPosts = async () => {
      let posts: Post[];

      try {
        if (forYou) {
          posts = await fetchForYouPosts();
          if (posts.length === 0) {
            localStorage.setItem("recentlyViewedPosts", "[]");
          }
        } else {
          posts = await fetchAllPosts();
          if (posts.length === 0) {
            localStorage.setItem("recentlyViewedPosts", "[]");
          }
        }

        setPosts({
          loaded: true,
          data: posts,
        });
      } catch (e) {
        const message = mapError(e);
        toast.error(message);
      }
    };

    fetchPosts();
  }, [forYou]);

  useEffect(() => {
    if (!posts.loaded || posts.data.length === 0) return;

    localStorage.setItem("recentlyViewedPosts", JSON.stringify(posts));
  }, [posts]);

  return (
    <ul className="flex flex-col gap-2 p-2">
      {posts.loaded ? (
        posts.data.map(post => (
          <PostListItem
            key={post.id}
            post={post}
          />
        ))
      ) : (
        <Loading />
      )}
      {posts.loaded && posts.data.length === 0 && (
        <p className="text-muted-foreground">No posts found.</p>
      )}
    </ul>
  );
};

export default PostsList;
