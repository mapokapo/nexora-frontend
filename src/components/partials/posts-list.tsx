import PostListItem from "@/components/post-list-item";
import { firestore } from "@/lib/firebase";
import { Post, postSchema } from "@/lib/types/Post";
import { collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";

const PostsList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const collectionRef = collection(firestore, "posts");

    return onSnapshot(collectionRef, snapshot => {
      if (snapshot.size === 0) {
        localStorage.setItem("recentlyViewedPosts", "[]");
      }

      snapshot.docChanges().forEach(change => {
        const result = postSchema.safeParse({
          id: change.doc.id,
          ...change.doc.data(),
        });

        if (!result.success) {
          console.error(result.error.errors);
          return;
        }

        const post = result.data;

        switch (change.type) {
          case "added":
            setPosts(posts => [...posts, post]);
            break;
          case "modified":
            setPosts(posts => posts.map(p => (p.id === post.id ? post : p)));
            break;
          case "removed":
            setPosts(posts => posts.filter(p => p.id !== post.id));
            break;
        }
      });
    });
  }, []);

  useEffect(() => {
    if (posts.length === 0) return;

    localStorage.setItem("recentlyViewedPosts", JSON.stringify(posts));
  }, [posts]);

  return (
    <ul className="flex flex-col gap-2 p-2">
      {posts.length === 0 && (
        <p className="text-muted-foreground">No posts found.</p>
      )}
      {posts.map(post => (
        <PostListItem
          key={post.id}
          post={post}
        />
      ))}
    </ul>
  );
};

export default PostsList;
