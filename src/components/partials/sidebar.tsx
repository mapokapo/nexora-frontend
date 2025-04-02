import PostListItem from "@/components/post-list-item";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Post, postSchema } from "@/lib/types/Post";
import { Home, Settings, Sparkle, UserCircle2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { z } from "zod";

const Sidebar: React.FC = () => {
  const [recentlyViewedPosts, setRecentlyViewedPosts] = useState<Post[]>([]);

  useEffect(() => {
    const result = z
      .array(postSchema)
      .safeParse(
        JSON.parse(localStorage.getItem("recentlyViewedPosts") ?? "[]")
      );

    if (!result.success) {
      localStorage.setItem("recentlyViewedPosts", "[]");
    } else {
      setRecentlyViewedPosts(result.data);
    }
  }, []);

  return (
    <aside className="sticky top-0 flex h-min min-w-56 flex-col justify-start gap-4 border-r border-border bg-card p-4 xl:min-w-64">
      <Link
        to="/app/home"
        className="flex w-full cursor-pointer items-center gap-2 rounded-lg p-2 hover:bg-muted">
        <Home />
        <span className="text-lg">Home</span>
      </Link>
      <Link
        to="/app/for-you"
        className="flex w-full cursor-pointer items-center gap-2 rounded-lg p-2 hover:bg-muted">
        <Sparkle />
        <span className="text-lg">For You</span>
      </Link>
      <Separator className="bg-muted" />
      <Link
        to="/app/profile"
        className="flex w-full cursor-pointer items-center gap-2 rounded-lg p-2 hover:bg-muted">
        <UserCircle2 />
        <span className="text-lg">Profile</span>
      </Link>
      <Link
        to="/app/settings"
        className="flex w-full cursor-pointer items-center gap-2 rounded-lg p-2 hover:bg-muted">
        <Settings />
        <span className="text-lg">Settings</span>
      </Link>
      {recentlyViewedPosts.length > 0 && (
        <div className="flex flex-col gap-4">
          <Separator className="bg-muted" />
          <span className="ml-2 text-lg font-semibold">Recently viewed</span>
        </div>
      )}
      <div className="flex flex-col gap-2">
        {recentlyViewedPosts.map(post => (
          <Dialog key={post.id}>
            <DialogTrigger className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1 text-lg hover:bg-muted">
              {post.title.slice(0, 20)}
            </DialogTrigger>
            <DialogContent className="bg-card">
              <DialogTitle className="sr-only">{post.title}</DialogTitle>
              <DialogDescription className="sr-only">
                {post.content}
              </DialogDescription>
              <PostListItem post={post} />
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
