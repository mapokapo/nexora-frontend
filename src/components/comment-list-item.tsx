import { Loading } from "@/components/loading";
import ProfilePicture from "@/components/profile-picture";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { firestore } from "@/lib/firebase";
import { useAppUser } from "@/lib/hooks/use-user";
import AsyncValue from "@/lib/types/AsyncValue";
import { Comment } from "@/lib/types/Comment";
import { Profile, profileSchema } from "@/lib/types/Profile";
import { mapError } from "@/lib/utils";
import { deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { Ellipsis, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface CommentListItemProps {
  comment: Comment;
}

const CommentListItem: React.FC<CommentListItemProps> = ({ comment }) => {
  const user = useAppUser();
  const [commenter, setCommenter] = useState<AsyncValue<Profile>>({
    loaded: false,
  });

  useEffect(() => {
    return onSnapshot(doc(firestore, "profiles", comment.userId), snapshot => {
      if (snapshot.exists()) {
        const result = profileSchema.safeParse({
          id: comment.userId,
          ...snapshot.data(),
        });

        if (!result.success) {
          console.error(result.error.errors);
          return;
        }

        setCommenter({
          loaded: true,
          data: result.data,
        });
      }
    });
  });

  const onDelete = async () => {
    try {
      await deleteDoc(doc(firestore, "comments", comment.id));
    } catch (error) {
      const message = mapError(error);
      toast.error(message);
    }
  };

  return (
    <li className="flex items-center gap-2 rounded-lg border border-border p-2 hover:bg-muted">
      <div className="h-6 w-6">
        {commenter.loaded ? (
          <ProfilePicture profile={commenter.data} />
        ) : (
          <Loading />
        )}
      </div>
      <span>{comment.content}</span>
      {comment.userId === user.uid && (
        <div className="ml-auto">
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
                className="flex items-center text-destructive"
                onClick={onDelete}>
                <Trash />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </li>
  );
};

export default CommentListItem;
