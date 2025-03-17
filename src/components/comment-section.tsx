import CommentListItem from "@/components/comment-list-item";
import CreateCommentForm from "@/components/partials/create-comment-form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { firestore } from "@/lib/firebase";
import { Comment, commentSchema } from "@/lib/types/Comment";
import { Post } from "@/lib/types/Post";
import { onSnapshot, query, collection, where } from "firebase/firestore";
import { useEffect, useState } from "react";

interface CommentSectionProps {
  post: Post;
  isCommenting: boolean;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  post,
  isCommenting,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    return onSnapshot(
      query(collection(firestore, "comments"), where("postId", "==", post.id)),
      snapshot => {
        snapshot.docChanges().forEach(change => {
          const result = commentSchema.safeParse({
            id: change.doc.id,
            ...change.doc.data(),
          });

          if (!result.success) {
            console.error(result.error.errors);
            return;
          }

          const comment = result.data;

          switch (change.type) {
            case "added":
              setComments(comments => [...comments, comment]);
              break;
            case "modified":
              setComments(comments =>
                comments.map(c => (c.id === comment.id ? comment : c))
              );
              break;
            case "removed":
              setComments(comments =>
                comments.filter(c => c.id !== comment.id)
              );
              break;
          }
        });
      }
    );
  }, [post.id]);

  return isCommenting ? (
    <div className="mt-2 flex flex-col gap-2">
      <Separator />
      <ul className="mx-1 flex flex-col gap-2">
        {comments.length === 0 && (
          <p className="text-muted-foreground">No comments.</p>
        )}
        {comments.map(comment => (
          <CommentListItem
            key={comment.id}
            comment={comment}
          />
        ))}
      </ul>
      <CreateCommentForm post={post} />
    </div>
  ) : (
    <Button
      className="ml-1 h-auto w-min p-1 pl-0 pt-0 text-sm font-semibold text-muted-foreground hover:bg-transparent"
      variant="ghost">
      {comments.length} comments
    </Button>
  );
};

export default CommentSection;
