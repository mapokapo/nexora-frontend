import { firestoreTimestampSchema } from "@/lib/utils";
import { Timestamp } from "firebase/firestore";
import { z } from "zod";

export const postSchema = z.object({
  id: z.string().min(1, "ID is required"),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
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

export type Post = z.infer<typeof postSchema>;
