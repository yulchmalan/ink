import { User } from "./user";

export type FriendStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface Friend {
  user: User;
  status: FriendStatus;
}
