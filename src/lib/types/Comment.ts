import { firestoreTimestampSchema } from "@/lib/utils";
import { Timestamp } from "firebase/firestore";
import { z } from "zod";

export const commentSchema = z.object({
  id: z.string().min(1, "ID is required"),
  content: z.string().min(1, "Content is required"),
  postId: z.string().min(1, "Post ID is required"),
  userId: z.string().min(1, "User ID is required"),
  createdAt: z
    .union([firestoreTimestampSchema, z.string()])
    .transform(data =>
      data instanceof Timestamp ? data.toDate() : new Date(data)
    ),
  updatedAt: z
    .union([firestoreTimestampSchema, z.string()])
    .transform(data =>
      data instanceof Timestamp ? data.toDate() : new Date(data)
    ),
});

export type Comment = z.infer<typeof commentSchema>;
