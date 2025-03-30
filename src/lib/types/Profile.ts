import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  photoURL: z.string().optional(),
  settings: z.object({
    allowCommentsFrom: z.enum(["everyone", "friends", "nobody"]),
    allowMessagesFrom: z.enum(["everyone", "friends", "nobody"]),
    allowFriendRequestsFrom: z.enum(["everyone", "mutuals", "nobody"]),
    allowProfileVisitsFrom: z.enum(["everyone", "friends", "nobody"]),
  }),
});

export type Profile = z.infer<typeof profileSchema>;
