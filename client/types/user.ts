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
  updatedAt?: Date
}

export type SavedTitle = {
  title: TitlePreview | null;
  rating?: number;
  last_open?: string;
  progress?: number;
  language?: string;
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
