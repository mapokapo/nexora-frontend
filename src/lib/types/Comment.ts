import { firestoreTimestampSchema } from "@/lib/utils";
import { z } from "zod";

export const commentSchema = z.object({
  id: z.string().min(1, "ID is required"),
  content: z.string().min(1, "Content is required"),
  postId: z.string().min(1, "Post ID is required"),
  userId: z.string().min(1, "User ID is required"),
  createdAt: firestoreTimestampSchema.transform(data => data.toDate()),
  updatedAt: firestoreTimestampSchema.transform(data => data.toDate()),
});

export type Comment = z.infer<typeof commentSchema>;
