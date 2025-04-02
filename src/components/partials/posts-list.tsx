import { Loading } from "@/components/loading";
import PostListItem from "@/components/post-list-item";
import { client } from "@/lib/api/client";
import { firestore } from "@/lib/firebase";
import AsyncValue from "@/lib/types/AsyncValue";
import { Post, postSchema } from "@/lib/types/Post";
import { mapError } from "@/lib/utils";
import {
  collection,
  onSnapshot,
  query,
  QuerySnapshot,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

interface PostsListProps {
  userId?: string;
  forYou: boolean;
}

const PostsList: React.FC<PostsListProps> = ({ userId, forYou }) => {
  const [posts, setPosts] = useState<AsyncValue<Post[]>>({ loaded: false });

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const handleSnapshot = (snapshot: QuerySnapshot) => {
      const posts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const result = z.array(postSchema).safeParse(posts);

      if (!result.success) {
        console.error(result.error.errors);
        return;
      }

      setPosts({
        loaded: true,
        data: result.data,
      });
    };

    const handleError = (error: unknown) => {
      console.error("Error fetching posts:", error);
      setPosts({ loaded: false });
      toast.error(mapError(error));
    };

    if (userId !== undefined) {
      const userPostsQuery = query(
        collection(firestore, "posts"),
        where("userId", "==", userId)
      );
      unsubscribe = onSnapshot(userPostsQuery, handleSnapshot, handleError);
    } else if (!forYou) {
      const allPostsQuery = collection(firestore, "posts");
      unsubscribe = onSnapshot(allPostsQuery, handleSnapshot, handleError);
    } else {
      const fetchForYouPosts = async () => {
        try {
          const res = await client["for-you"].$get();
          const data = await res.json();

          const result = z.array(postSchema).safeParse(data);

          if (!result.success) {
            console.error(result.error.errors);
            setPosts({ loaded: true, data: [] });
            return;
          }

          setPosts({ loaded: true, data: result.data });
        } catch (error) {
          const message = mapError(error);
          toast.error(message);
          setPosts({ loaded: true, data: [] });
        }
      };

      fetchForYouPosts();
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [forYou, userId]);

  useEffect(() => {
    if (!posts.loaded || posts.data.length === 0) return;

    localStorage.setItem("recentlyViewedPosts", JSON.stringify(posts.data));
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
