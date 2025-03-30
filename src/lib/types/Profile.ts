import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  photoURL: z.string().optional(),
});

export type Profile = z.infer<typeof profileSchema>;
