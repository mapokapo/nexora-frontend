import CommentSection from "@/components/comment-section";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { cn, getRelativeTime, mapError } from "@/lib/utils";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import {
  Ellipsis,
  Heart,
  MessageCirclePlus,
  PenBox,
  Trash,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

interface PostListItemProps {
  post: Post;
}

const PostListItem: React.FC<PostListItemProps> = ({ post }) => {
  const [isCommenting, setIsCommenting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [newPost, setNewPost] = useState({
    title: post.title,
    content: post.content,
  });

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

  const onDelete = async () => {
    try {
      const postComments = await getDocs(
        query(collection(firestore, "comments"), where("postId", "==", post.id))
      );
      const postLikes = await getDocs(
        query(collection(firestore, "likes"), where("postId", "==", post.id))
      );

      const batch = writeBatch(firestore);
      batch.delete(doc(firestore, "posts", post.id));
      postComments.forEach(result => batch.delete(result.ref));
      postLikes.forEach(result => batch.delete(result.ref));
      await batch.commit();
    } catch (error) {
      const message = mapError(error);
      toast.error(message);
    }
  };

  const resetPostEditForm = () => {
    setNewPost({ title: post.title, content: post.content });
    setIsEditMode(false);
  };

  const updatePost = async () => {
    setIsUpdateLoading(true);

    try {
      await updateDoc(doc(firestore, "posts", post.id), newPost);

      resetPostEditForm();
    } catch (error) {
      const message = mapError(error);
      toast.error(message);
    }

    setIsUpdateLoading(false);
  };

  return (
    <li className="flex flex-col rounded-lg bg-card p-3 pl-2 text-card-foreground">
      <div className="flex items-center justify-between gap-2">
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
        <span className="ml-auto text-sm text-muted-foreground">
          {post.createdAt.getTime() === post.updatedAt.getTime()
            ? (getRelativeTime(post.createdAt) ?? "")
            : `${getRelativeTime(post.updatedAt) ?? ""} (edited)`}
        </span>
        {post.userId === user.uid && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="h-auto w-auto p-1"
                variant="ghost"
                size="icon">
                <Ellipsis size={24} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                className="flex items-center"
                onClick={() => setIsEditMode(true)}>
                <PenBox />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center text-destructive"
                onClick={onDelete}>
                <Trash />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div className={cn("flex flex-col", isEditMode && "gap-2")}>
        {isEditMode ? (
          <Input
            value={newPost.title}
            onChange={e =>
              setNewPost(prev => ({ ...prev, title: e.target.value }))
            }
          />
        ) : (
          <span className="ml-1 text-lg font-bold">{post.title}</span>
        )}
        {isEditMode ? (
          <Textarea
            value={newPost.content}
            onChange={e =>
              setNewPost(prev => ({ ...prev, content: e.target.value }))
            }
          />
        ) : (
          <p className="ml-1">{post.content}</p>
        )}
        {isEditMode && (
          <div className="ml-auto flex gap-2">
            <Button
              variant="destructive"
              onClick={resetPostEditForm}
              disabled={isUpdateLoading}>
              Cancel
            </Button>
            <Button
              onClick={updatePost}
              disabled={isUpdateLoading}>
              Save
            </Button>
          </div>
        )}
      </div>
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
