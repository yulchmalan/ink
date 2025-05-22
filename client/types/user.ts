export type UserStats = {
  materialsAdded?: number;
  titlesCreated?: number;
};

export interface TitlePreview {
  id: string;
  name: string;
  type: "COMIC" | "NOVEL";
  content?: {
    chapter?: number;
  };
  alt_names?: {
    lang: string;
    value: string;
  }[];
  updatedAt?: Date;
}

export type SavedTitle = {
  title: TitlePreview | null;
  rating?: number;
  last_open?: string;
  progress?: number;
  language?: string;
  added?: string;
};

export type List = {
  name: string;
  titles: SavedTitle[];
};

export type FriendStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export type Friend = {
  user: User;
  status: FriendStatus;
};

export type Comment = {
  _id: string;
  message: string;
  createdAt: string;
  // інші поля за потреби
};

export type Review = {
  _id: string;
  content: string;
  createdAt: string;
};

export type User = {
  _id: string;
  username: string;
  email: string;
  role: "USER" | "MODERATOR" | "ADMIN" | "OWNER";
  bio?: string;
  exp: number;
  createdAt: string;
  updatedAt?: string;
  last_online?: string;

  stats?: UserStats;
  lists?: List[];
  friends: Friend[];
  reviews?: Review[];
  comments?: Comment[];
  recommendations?: TitlePreview[];
};
