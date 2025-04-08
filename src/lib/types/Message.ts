import { firestoreTimestampSchema } from "@/lib/utils";
import { Timestamp } from "firebase/firestore";
import { z } from "zod";

export const messageSchema = z.object({
  id: z.string(),
  senderId: z.string(),
  receiverId: z.string(),
  content: z.string(),
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

export type Message = z.infer<typeof messageSchema>;
