export type UserStats = {
  materialsAdded?: number;
  titlesCreated?: number;
};

export type TitlePreview = {
  _id: string;
  name: string;
  cover?: string;
  type?: "COMIC" | "NOVEL";
};

export type SavedTitle = {
  title: TitlePreview | null;
  rating?: number;
  last_open?: string;
  progress?: number;
};

export type List = {
  name: string;
  titles: SavedTitle[];
};

export type User = {
  _id: string;
  username: string;
  email: string;
  role: "USER" | "MODERATOR" | "ADMIN" | "OWNER";
  createdAt: string;
  exp: number;
  stats?: UserStats;
  bio?: string;
  lists?: List[];
};
