import { z } from "zod";

export const friendRequestsSchema = z.object({
  /**
   * The user ID of the current user.
   */
  userId: z.string(),
  /**
   * Array of user IDs that the current user has sent friend requests to.
   */
  sentRequests: z.array(z.string()),
  /**
   * Array of user IDs that have sent friend requests to the current user.
   */
  receivedRequests: z.array(z.string()),
  /**
   * Array of user IDs that are confirmed friends with the current user.
   *
   * Note that once a friend request is accepted (either from `sentRequests` or `receivedRequests`), that user ID will be removed from that array and put into `allFriends` through a server-side function.
   */
  allFriends: z.array(z.string()),
});

export type FriendRequests = z.infer<typeof friendRequestsSchema>;
