import { Loading } from "@/components/loading";
import ProfilePicture from "@/components/profile-picture";
import { firestore } from "@/lib/firebase";
import AsyncValue from "@/lib/types/AsyncValue";
import { Comment } from "@/lib/types/Comment";
import { Profile, profileSchema } from "@/lib/types/Profile";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";

interface CommentListItemProps {
  comment: Comment;
}

const CommentListItem: React.FC<CommentListItemProps> = ({ comment }) => {
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

  return (
    <li className="flex items-center gap-2 rounded-lg border border-border p-2 hover:bg-muted">
      <div className="h-6 w-6">
        {commenter.loaded ? (
          <ProfilePicture
            userName={commenter.data.name}
            photoURL={null}
          />
        ) : (
          <Loading />
        )}
      </div>
      <span>{comment.content}</span>
    </li>
  );
};

export default CommentListItem;
