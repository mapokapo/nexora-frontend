import { firestoreTimestampSchema } from "@/lib/utils";
import { z } from "zod";

export const postSchema = z.object({
  id: z.string().min(1, "ID is required"),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  userId: z.string().min(1, "User ID is required"),
  createdAt: firestoreTimestampSchema.transform(data => data.toDate()),
  updatedAt: firestoreTimestampSchema.transform(data => data.toDate()),
});

export type Post = z.infer<typeof postSchema>;
