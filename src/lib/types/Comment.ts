import { z } from "zod";

export const commentSchema = z.object({
  id: z.string().min(1, "ID is required"),
  content: z.string().min(1, "Content is required"),
  postId: z.string().min(1, "Post ID is required"),
  userId: z.string().min(1, "User ID is required"),
});

export type Comment = z.infer<typeof commentSchema>;
