import CommentSection from "@/components/comment-section";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { firestore } from "@/lib/firebase";
import { useAppUser } from "@/lib/hooks/use-user";
import AsyncValue from "@/lib/types/AsyncValue";
import { Post } from "@/lib/types/Post";
import { Profile, profileSchema } from "@/lib/types/Profile";
import { cn, getRelativeTime } from "@/lib/utils";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { Heart, MessageCirclePlus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router";

interface PostListItemProps {
  post: Post;
}

const PostListItem: React.FC<PostListItemProps> = ({ post }) => {
  const [isCommenting, setIsCommenting] = useState(false);

  const [isLiked, setIsLiked] = useState(false);
  const [numLikes, setNumLikes] = useState(0);

  const [likeLoading, setLikeLoading] = useState(false);

  const [postCreator, setPostCreator] = useState<AsyncValue<Profile>>({
    loaded: false,
  });

  const user = useAppUser();

  useEffect(() => {
    return onSnapshot(
      query(collection(firestore, "likes"), where("postId", "==", post.id)),
      snapshot => {
        setNumLikes(snapshot.size);

        if (snapshot.docs.some(like => like.get("userId") === user.uid)) {
          setIsLiked(true);
        } else {
          setIsLiked(false);
        }
      }
    );
  }, [post.id, user.uid]);

  useEffect(() => {
    return onSnapshot(doc(firestore, "profiles", post.userId), snapshot => {
      const result = profileSchema.safeParse({
        id: snapshot.id,
        ...snapshot.data(),
      });

      if (!result.success) {
        console.error(result.error.errors);
        return;
      }

      setPostCreator({
        loaded: true,
        data: result.data,
      });
    });
  }, [post.userId]);

  const likePost = async () => {
    setLikeLoading(true);

    const existingLikeDoc = await getDocs(
      query(
        collection(firestore, "likes"),
        where("postId", "==", post.id),
        where("userId", "==", user.uid)
      )
    );

    if (existingLikeDoc.size > 1) {
      console.error(`Post ${post.id} has multiple likes from the same user`);
      return;
    }

    if (existingLikeDoc.size === 1) {
      await deleteDoc(existingLikeDoc.docs[0].ref);
    } else {
      await addDoc(collection(firestore, "likes"), {
        postId: post.id,
        userId: user.uid,
      });
    }

    setLikeLoading(false);
  };

  return (
    <li className="flex flex-col rounded-lg bg-card p-3 pl-2 text-card-foreground">
      <div className="flex items-center justify-between">
        <Button
          className="mb-1 ml-1 h-auto w-min p-0 hover:bg-transparent"
          variant="link">
          {postCreator.loaded ? (
            <Link
              className="text-muted-foreground"
              to={`/app/profile/${post.userId}`}>
              {postCreator.data.name}
            </Link>
          ) : (
            <span className="animate-pulse text-sm text-muted-foreground">
              Loading user...
            </span>
          )}
        </Button>
        <span className="text-sm text-muted-foreground">
          {post.createdAt.getTime() === post.updatedAt.getTime()
            ? (getRelativeTime(post.createdAt) ?? "")
            : `${getRelativeTime(post.updatedAt) ?? ""} (edited)`}
        </span>
      </div>
      <span className="ml-1 text-lg font-bold">{post.title}</span>
      <p className="ml-1">{post.content}</p>
      <TooltipProvider>
        <div className="mt-2 flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="group h-auto w-auto p-1 hover:bg-transparent"
                onClick={likePost}
                disabled={likeLoading}
                variant="ghost"
                size="icon">
                <Heart
                  className={cn(
                    "!h-5 !w-5 overflow-hidden transition-colors",
                    isLiked
                      ? "fill-red-500 stroke-red-500"
                      : "group-hover:fill-red-500 group-hover:stroke-red-500"
                  )}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Like this post</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="h-auto w-auto p-1"
                onClick={() => setIsCommenting(prev => !prev)}
                variant="ghost"
                size="icon">
                <MessageCirclePlus className="!h-5 !w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add a comment</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
      <span className="ml-1 text-sm font-semibold">{numLikes} likes</span>
      <CommentSection
        post={post}
        isCommenting={isCommenting}
      />
    </li>
  );
};

export default PostListItem;
